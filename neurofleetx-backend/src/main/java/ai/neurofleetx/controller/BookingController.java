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
            System.out.println("===== BOOKING PAYLOAD =====");
            System.out.println(payload);

            if (payload.get("vehicleId") == null || payload.get("vehicleId").toString().isEmpty()) {
                return ResponseEntity.badRequest().body("Vehicle ID missing");
            }

            Booking booking = new Booking();
            booking.setCustomerName(payload.get("customerName").toString());
            booking.setCustomerPhone(payload.get("customerPhone").toString());
            booking.setPickupLocation(payload.get("pickupLocation").toString());
            booking.setDropLocation(payload.get("dropLocation").toString());

            // Read customer email (optional)
            if (payload.containsKey("email") && payload.get("email") != null && !payload.get("email").toString().isEmpty()) {
                booking.setEmail(payload.get("email").toString());
            }

            String scheduledDate = payload.get("scheduledDate").toString();
            booking.setScheduledDate(LocalDateTime.parse(scheduledDate));

            Integer vehicleId = Integer.valueOf(payload.get("vehicleId").toString());
            Booking savedBooking = bookingService.createBookingWithVehicleId(booking, vehicleId);

            // Send email to admin
            try {
                emailService.sendBookingNotificationToAdmin(savedBooking);
            } catch (Exception mailError) {
                System.out.println("ADMIN EMAIL FAILED BUT BOOKING SAVED");
                mailError.printStackTrace();
            }

            // Send confirmation email to customer
            try {
                emailService.sendBookingConfirmationToCustomer(savedBooking);
            } catch (Exception mailError) {
                System.out.println("CUSTOMER EMAIL FAILED BUT BOOKING SAVED");
                mailError.printStackTrace();
            }

            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Booking Error: " + e.getMessage());
        }
    }
}
