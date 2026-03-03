package ai.neurofleetx.controller;

import ai.neurofleetx.model.Vehicle;
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
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    private final UserService userService;
    private final VehicleRepository vehicleRepository;

    public AdminController(UserService userService,
                           VehicleRepository vehicleRepository) {
        this.userService = userService;
        this.vehicleRepository = vehicleRepository;
    }

    /**
     * Dashboard Statistics
     * Matches frontend: stats.totalVehicles, stats.totalUsers
     */
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

    /**
     * Fleet Management
     */
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle) {
        // Syncing field names with frontend 'status'
        if (vehicle.getStatus() == null) vehicle.setStatus("AVAILABLE");
        
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    /**
     * Update Vehicle Details
     */
    @PutMapping("/vehicles/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Integer id, @RequestBody Vehicle details) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setName(details.getName());
            vehicle.setDriverName(details.getDriverName());
            vehicle.setStatus(details.getStatus()); // Matches select dropdown
            vehicle.setHealth(details.getHealth()); // Matches numeric input
            vehicle.setUpdatedAt(LocalDateTime.now());
            
            Vehicle updated = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete Vehicle
     */
    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Integer id) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
    }
}