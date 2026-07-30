package ai.neurofleetx.service;

import ai.neurofleetx.dto.RouteResponse;
import ai.neurofleetx.model.*;
import ai.neurofleetx.repository.RoadNetworkRepository;
import ai.neurofleetx.repository.RouteRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RoadNetworkRepository roadNetworkRepository;
    private final GeocodingService geocodingService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving/";

    public RouteService(RouteRepository routeRepository,
                        RoadNetworkRepository roadNetworkRepository,
                        GeocodingService geocodingService) {
        this.routeRepository = routeRepository;
        this.roadNetworkRepository = roadNetworkRepository;
        this.geocodingService = geocodingService;
    }

    public RouteResponse optimize(String start, String end) {
        return optimize(start, end, null, null, null, null);
    }

    public RouteResponse optimize(String start, String end,
                                   Double startLat, Double startLng,
                                   Double endLat, Double endLng) {
        String source = start.trim().toLowerCase();
        String destination = end.trim().toLowerCase();

        List<RoadNetwork> connections = roadNetworkRepository.findAll();
        Map<String, Node> nodes = new HashMap<>();

        for (RoadNetwork conn : connections) {
            String uName = conn.getSourceCity().toLowerCase();
            String vName = conn.getTargetCity().toLowerCase();
            nodes.putIfAbsent(uName, new Node(uName));
            nodes.putIfAbsent(vName, new Node(vName));
            nodes.get(uName).addEdge(new Edge(nodes.get(vName), conn.getDistance()));
            nodes.get(vName).addEdge(new Edge(nodes.get(uName), conn.getDistance()));
        }

        if (nodes.containsKey(source) && nodes.containsKey(destination)) {
            return runDijkstraOnGraph(nodes, source, destination);
        }

        return runOsrmFallback(source, destination, startLat, startLng, endLat, endLng);
    }

    private RouteResponse runDijkstraOnGraph(Map<String, Node> nodes, String source, String destination) {
        Node startNode = nodes.get(source);
        startNode.setMinDistance(0);
        PriorityQueue<Node> queue = new PriorityQueue<>(Comparator.comparingDouble(Node::getMinDistance));
        queue.add(startNode);

        while (!queue.isEmpty()) {
            Node u = queue.poll();
            for (Edge e : u.getAdjacencies()) {
                Node v = e.getTarget();
                double weight = e.getWeight();
                if (u.getMinDistance() + weight < v.getMinDistance()) {
                    queue.remove(v);
                    v.setMinDistance(u.getMinDistance() + weight);
                    v.setPrevious(u);
                    queue.add(v);
                }
            }
        }

        Node targetNode = nodes.get(destination);
        if (targetNode.getMinDistance() == Double.POSITIVE_INFINITY) {
            throw new RuntimeException("No road path exists between " + source + " and " + destination);
        }

        List<String> path = new ArrayList<>();
        for (Node n = targetNode; n != null; n = n.getPrevious()) {
            path.add(n.getName());
        }
        Collections.reverse(path);

        double distance = targetNode.getMinDistance();
        double duration = distance / 60.0;

        // Fetch actual road geometry for each edge in the Dijkstra path
        List<List<Double>> combinedGeometry = fetchGeometryForPath(path);

        Route saved = routeRepository.save(new Route(path.toString(), distance, duration));
        return new RouteResponse(saved.getId(), path, distance, duration, combinedGeometry);
    }

    private List<List<Double>> fetchGeometryForPath(List<String> path) {
        List<List<Double>> combinedGeometry = new ArrayList<>();

        for (int i = 0; i < path.size() - 1; i++) {
            String cityA = path.get(i);
            String cityB = path.get(i + 1);

            try {
                double[] coordsA = geocodingService.getCoordinates(cityA);
                double[] coordsB = geocodingService.getCoordinates(cityB);

                if (coordsA == null || coordsB == null) continue;

                String osrmUrl = OSRM_BASE_URL
                        + coordsA[1] + "," + coordsA[0]
                        + ";" + coordsB[1] + "," + coordsB[0]
                        + "?overview=full&geometries=geojson&steps=false";

                HttpHeaders headers = new HttpHeaders();
                headers.set("User-Agent", "NeuroFleetX_App");
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(
                        osrmUrl, HttpMethod.GET, entity, String.class);

                JsonNode root = objectMapper.readTree(response.getBody());

                if (root.get("code") != null && root.get("code").asText().equals("Ok")) {
                    JsonNode geometryNode = root.get("routes").get(0).get("geometry");
                    if (geometryNode != null && geometryNode.has("coordinates")) {
                        JsonNode coords = geometryNode.get("coordinates");
                        // Skip first point of subsequent segments to avoid duplicate points at junctions
                        int startIdx = (i > 0 && combinedGeometry.size() > 0) ? 1 : 0;
                        for (int j = startIdx; j < coords.size(); j++) {
                            JsonNode coord = coords.get(j);
                            combinedGeometry.add(Arrays.asList(
                                    coord.get(1).asDouble(),
                                    coord.get(0).asDouble()
                            ));
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch geometry for " + cityA + " -> " + cityB + ": " + e.getMessage());
            }
        }

        return combinedGeometry;
    }

    private RouteResponse runOsrmFallback(String source, String destination,
                                           Double startLat, Double startLng,
                                           Double endLat, Double endLng) {
        try {
            double[] startCoords = (startLat != null && startLng != null)
                    ? new double[]{startLat, startLng}
                    : geocodingService.getCoordinates(source);

            double[] endCoords = (endLat != null && endLng != null)
                    ? new double[]{endLat, endLng}
                    : geocodingService.getCoordinates(destination);

            if (startCoords == null) {
                throw new RuntimeException("Could not geocode city: " + source);
            }
            if (endCoords == null) {
                throw new RuntimeException("Could not geocode city: " + destination);
            }

            String osrmUrl = OSRM_BASE_URL
                    + startCoords[1] + "," + startCoords[0]
                    + ";" + endCoords[1] + "," + endCoords[0]
                    + "?overview=full&geometries=geojson&steps=true";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "NeuroFleetX_App");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    osrmUrl, HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            if (root.get("code") == null || !root.get("code").asText().equals("Ok")) {
                throw new RuntimeException("OSRM could not find a route between " + source + " and " + destination);
            }

            JsonNode route = root.get("routes").get(0);
            double distanceKm = route.get("distance").asDouble() / 1000.0;
            double durationHrs = route.get("duration").asDouble() / 3600.0;

            // Extract full road geometry (actual road path coordinates)
            List<List<Double>> geometry = new ArrayList<>();
            JsonNode geometryNode = route.get("geometry");
            if (geometryNode != null && geometryNode.has("coordinates")) {
                JsonNode coords = geometryNode.get("coordinates");
                for (JsonNode coord : coords) {
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    geometry.add(Arrays.asList(coord.get(1).asDouble(), coord.get(0).asDouble()));
                }
            }

            JsonNode waypoints = root.get("waypoints");
            List<String> path = new ArrayList<>();
            path.add(source);

            if (waypoints != null && waypoints.size() > 2) {
                for (int i = 1; i < waypoints.size() - 1; i++) {
                    JsonNode wp = waypoints.get(i);
                    if (wp.has("name") && wp.get("name").asText() != null && !wp.get("name").asText().isEmpty()) {
                        path.add(wp.get("name").asText().toLowerCase());
                    }
                }
            }
            path.add(destination);

            Route saved = routeRepository.save(new Route(path.toString(), distanceKm, durationHrs));
            return new RouteResponse(saved.getId(), path, distanceKm, durationHrs, geometry);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate route via OSRM: " + e.getMessage(), e);
        }
    }
}
