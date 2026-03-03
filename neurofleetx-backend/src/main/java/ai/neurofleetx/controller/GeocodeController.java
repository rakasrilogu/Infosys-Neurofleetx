package ai.neurofleetx.controller;

import ai.neurofleetx.service.GeocodingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GeocodeController {

    private final GeocodingService geocodingService;

    public GeocodeController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Object>> geocode(@RequestParam String address) {
        double[] coords = geocodingService.getCoordinates(address);
        if (coords != null) {
            return ResponseEntity.ok(Map.of(
                "lat", coords[0],
                "lng", coords[1],
                "name", address
            ));
        }
        return ResponseEntity.notFound().build();
    }
}