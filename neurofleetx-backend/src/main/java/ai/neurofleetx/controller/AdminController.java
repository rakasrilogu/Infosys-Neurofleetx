package ai.neurofleetx.controller;

import ai.neurofleetx.model.RoadNetwork;
import ai.neurofleetx.model.Vehicle;
import ai.neurofleetx.repository.RoadNetworkRepository;
import ai.neurofleetx.repository.VehicleRepository;
import ai.neurofleetx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://infosys-neurofleetx.vercel.app"
})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final VehicleRepository vehicleRepository;
    private final RoadNetworkRepository roadNetworkRepository;

    public AdminController(UserService userService,
                           VehicleRepository vehicleRepository,
                           RoadNetworkRepository roadNetworkRepository) {
        this.userService = userService;
        this.vehicleRepository = vehicleRepository;
        this.roadNetworkRepository = roadNetworkRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(Map.of(
                    "totalVehicles", vehicleRepository.count(),
                    "totalUsers", userService.findAll().size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle) {
        if (vehicle.getStatus() == null) vehicle.setStatus("AVAILABLE");
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Integer id, @RequestBody Vehicle details) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setName(details.getName());
            vehicle.setDriverName(details.getDriverName());
            vehicle.setStatus(details.getStatus());
            vehicle.setHealth(details.getHealth());
            vehicle.setUpdatedAt(LocalDateTime.now());
            Vehicle updated = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Integer id) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
    }

    @GetMapping("/road-network")
    public ResponseEntity<List<RoadNetwork>> getAllRoadNetwork() {
        return ResponseEntity.ok(roadNetworkRepository.findAll());
    }

    @PostMapping("/road-network")
    public ResponseEntity<?> addRoadEdge(@RequestBody RoadNetwork roadNetwork) {
        if (roadNetwork.getSourceCity() == null || roadNetwork.getTargetCity() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "sourceCity and targetCity are required"));
        }
        if (roadNetwork.getDistance() == null || roadNetwork.getDistance() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "distance must be a positive number"));
        }
        roadNetwork.setSourceCity(roadNetwork.getSourceCity().trim().toLowerCase());
        roadNetwork.setTargetCity(roadNetwork.getTargetCity().trim().toLowerCase());

        RoadNetwork existing = roadNetworkRepository.findByCities(roadNetwork.getSourceCity(), roadNetwork.getTargetCity());
        if (existing != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "This road edge already exists. Use PUT to update."));
        }

        RoadNetwork saved = roadNetworkRepository.save(roadNetwork);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/road-network/{id}")
    public ResponseEntity<?> updateRoadEdge(@PathVariable Long id, @RequestBody RoadNetwork details) {
        return roadNetworkRepository.findById(id).map(edge -> {
            if (details.getSourceCity() != null) edge.setSourceCity(details.getSourceCity().trim().toLowerCase());
            if (details.getTargetCity() != null) edge.setTargetCity(details.getTargetCity().trim().toLowerCase());
            if (details.getDistance() != null && details.getDistance() > 0) edge.setDistance(details.getDistance());
            RoadNetwork updated = roadNetworkRepository.save(edge);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/road-network/{id}")
    public ResponseEntity<?> deleteRoadEdge(@PathVariable Long id) {
        if (!roadNetworkRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Road edge not found"));
        }
        roadNetworkRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Road edge deleted successfully"));
    }
}
