package ai.neurofleetx.service;

import ai.neurofleetx.dto.RouteResponse;
import ai.neurofleetx.model.*;
import ai.neurofleetx.repository.RoadNetworkRepository;
import ai.neurofleetx.repository.RouteRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RoadNetworkRepository roadNetworkRepository;

    public RouteService(RouteRepository routeRepository, RoadNetworkRepository roadNetworkRepository) {
        this.routeRepository = routeRepository;
        this.roadNetworkRepository = roadNetworkRepository;
    }

    public RouteResponse optimize(String start, String end) {
        // 1. Normalize Inputs
        String source = start.trim().toLowerCase();
        String destination = end.trim().toLowerCase();

        // 2. Load Graph from Database
        List<RoadNetwork> connections = roadNetworkRepository.findAll();
        if (connections.isEmpty()) {
            throw new RuntimeException("Map data is missing in the database!");
        }

        Map<String, Node> nodes = new HashMap<>();

        for (RoadNetwork conn : connections) {
            String uName = conn.getSourceCity().toLowerCase();
            String vName = conn.getTargetCity().toLowerCase();
            
            nodes.putIfAbsent(uName, new Node(uName));
            nodes.putIfAbsent(vName, new Node(vName));
            
            // Add edge: Source to Target
            nodes.get(uName).addEdge(new Edge(nodes.get(vName), conn.getDistance()));
            // Add edge: Target to Source (Ensures bidirectional travel)
            nodes.get(vName).addEdge(new Edge(nodes.get(uName), conn.getDistance()));
        }

        // 3. Validation
        if (!nodes.containsKey(source) || !nodes.containsKey(destination)) {
            throw new RuntimeException("City not found in our map: " + source + " or " + destination);
        }

        // 4. Dijkstra Algorithm
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

        // 5. Build Result Path
        Node targetNode = nodes.get(destination);
        if (targetNode.getMinDistance() == Double.POSITIVE_INFINITY) {
            throw new RuntimeException("No road path exists between " + start + " and " + end);
        }

        List<String> path = new ArrayList<>();
        for (Node n = targetNode; n != null; n = n.getPrevious()) {
            path.add(n.getName());
        }
        Collections.reverse(path);

        // 6. Save and Return
        double distance = targetNode.getMinDistance();
        double duration = distance / 60.0; // Simple calculation (60km/h)
        
        Route saved = routeRepository.save(new Route(path.toString(), distance, duration));
        
        return new RouteResponse(saved.getId(), path, distance, duration);
    }
}