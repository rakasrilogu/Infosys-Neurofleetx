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

            // ✅ Customer Details
            booking.setCustomerName(
                    payload.get("customerName").toString()
            );

            booking.setCustomerPhone(
                    payload.get("customerPhone").toString()
            );

            booking.setPickupLocation(
                    payload.get("pickupLocation").toString()
            );

            booking.setDropLocation(
                    payload.get("dropLocation").toString()
            );

            // ✅ Safe Date Parsing
            String date =
                    payload.get("scheduledDate")
                            .toString()
                            .replace(" ", "T");

            booking.setScheduledDate(
                    LocalDateTime.parse(date)
            );

            // ✅ Safe vehicleId Conversion
            Integer vehicleId =
                    Integer.valueOf(
                            payload.get("vehicleId").toString()
                    );

            // ✅ Save Booking
            Booking saved =
                    bookingService.createBookingWithVehicleId(
                            booking,
                            vehicleId
                    );

            // ✅ Send Email to Admin
            emailService.sendBookingNotificationToAdmin(saved);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body("Server Error: " + e.getMessage());
        }
    }
}
