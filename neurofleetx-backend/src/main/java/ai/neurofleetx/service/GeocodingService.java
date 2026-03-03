package ai.neurofleetx.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public double[] getCoordinates(String location) {
        try {
            String encoded = java.net.URLEncoder.encode(location, "UTF-8");
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + encoded + "&limit=1";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "NeuroFleetX_App"); 
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);
            Map[] body = response.getBody();

            if (body != null && body.length > 0) {
                double lat = Double.parseDouble(body[0].get("lat").toString());
                double lon = Double.parseDouble(body[0].get("lon").toString());
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            System.err.println("Geocoding failed: " + e.getMessage());
        }
        return null;
    }
}