package ai.neurofleetx.controller;

import ai.neurofleetx.dto.RouteRequest;
import ai.neurofleetx.dto.RouteResponse;
import ai.neurofleetx.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://infosys-neurofleetx.vercel.app"
})
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeRoute(@RequestBody RouteRequest request) {
        try {
            RouteResponse response = routeService.optimize(
                    request.getStartCity(),
                    request.getEndCity(),
                    request.getStartLat(),
                    request.getStartLng(),
                    request.getEndLat(),
                    request.getEndLng()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
