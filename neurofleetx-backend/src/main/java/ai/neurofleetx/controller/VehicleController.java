package ai.neurofleetx.controller;

import ai.neurofleetx.model.Vehicle;
import ai.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")

// Allow both Localhost and Vercel frontend
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://infosys-neurofleetx.vercel.app"
}, allowCredentials = "true")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // Fetch all vehicles
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAll() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    // Fetch only available vehicles
    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailable() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

    // Create new vehicle
    @PostMapping
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.saveVehicle(vehicle));
    }

    // Update vehicle availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<Vehicle> updateAvailability(
            @PathVariable Integer id,
            @RequestParam String availabilityStatus) {

        Vehicle updated = vehicleService.updateAvailabilityStatus(id, availabilityStatus);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
