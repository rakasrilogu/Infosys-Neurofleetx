package ai.neurofleetx.service;

import ai.neurofleetx.model.Booking;
import ai.neurofleetx.model.Vehicle;
import ai.neurofleetx.repository.BookingRepository;
import ai.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public Booking createBookingWithVehicleId(Booking booking, Integer vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Driver not found in system."));
        
        booking.setVehicle(vehicle);
        vehicle.setAvailabilityStatus("BOOKED"); // This removes them from the "Available" list
        
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }
}