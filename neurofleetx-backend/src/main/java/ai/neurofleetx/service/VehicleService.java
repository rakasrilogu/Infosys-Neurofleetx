package ai.neurofleetx.service;

import ai.neurofleetx.model.Vehicle;
import ai.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Integer id) {
        return vehicleRepository.findById(id).orElse(null);
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public boolean deleteVehicle(Integer id) {
        if (vehicleRepository.existsById(id)) {
            vehicleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ✅ Logic to return only available drivers to the user
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailabilityStatus("AVAILABLE");
    }

    public List<Vehicle> searchVehiclesByName(String query) {
        return vehicleRepository.searchByName(query);
    }

    public Vehicle updateVehicleLocation(Integer id, Double lat, Double lng) {
        Optional<Vehicle> vOpt = vehicleRepository.findById(id);
        if (vOpt.isPresent()) {
            Vehicle v = vOpt.get();
            v.setLat(lat);
            v.setLng(lng);
            return vehicleRepository.save(v);
        }
        return null;
    }

    public Vehicle updateAvailabilityStatus(Integer id, String status) {
        Optional<Vehicle> vOpt = vehicleRepository.findById(id);
        if (vOpt.isPresent()) {
            Vehicle v = vOpt.get();
            v.setAvailabilityStatus(status);
            return vehicleRepository.save(v);
        }
        return null;
    }
}