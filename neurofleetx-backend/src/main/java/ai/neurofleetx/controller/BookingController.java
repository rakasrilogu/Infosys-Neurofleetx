package ai.neurofleetx.controller;

import ai.neurofleetx.model.Booking;
import ai.neurofleetx.service.BookingService;
import ai.neurofleetx.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")

// ✅ Allow both local + deployed frontend
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://infosys-neurofleetx.vercel.app"
})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> payload) {
        try {
            Booking booking = new Booking();
            booking.setCustomerName((String) payload.get("customerName"));
            booking.setCustomerPhone((String) payload.get("customerPhone"));
            booking.setPickupLocation((String) payload.get("pickupLocation"));
            booking.setDropLocation((String) payload.get("dropLocation"));

            // Ensure ISO format from frontend: YYYY-MM-DDTHH:mm
            booking.setScheduledDate(LocalDateTime.parse((String) payload.get("scheduledDate")));

            Integer vehicleId = (Integer) payload.get("vehicleId");

            // Save booking
            Booking saved = bookingService.createBookingWithVehicleId(booking, vehicleId);

            // Notify admin
            emailService.sendBookingNotificationToAdmin(saved);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Server Error: " + e.getMessage());
        }
    }
}
