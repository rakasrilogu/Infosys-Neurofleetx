package ai.neurofleetx.controller;

import ai.neurofleetx.dto.RouteRequest;
import ai.neurofleetx.dto.RouteResponse;
import ai.neurofleetx.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")

// ✅ Allow both local + deployed frontend
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
    public ResponseEntity<RouteResponse> optimizeRoute(@RequestBody RouteRequest request) {
        try {
            RouteResponse response = routeService.optimize(
                    request.getStartCity(),
                    request.getEndCity()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
