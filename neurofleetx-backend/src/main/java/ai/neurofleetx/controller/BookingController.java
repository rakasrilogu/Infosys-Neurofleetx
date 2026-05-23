

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
    public ResponseEntity<?> createBooking(
            @RequestBody Map<String, Object> payload) {

        try {

            System.out.println("===== BOOKING PAYLOAD =====");
            System.out.println(payload);

            // ✅ Validate Vehicle ID
            if (payload.get("vehicleId") == null ||
                    payload.get("vehicleId").toString().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Vehicle ID missing");
            }

            Booking booking = new Booking();

            // ✅ Customer Name
            booking.setCustomerName(
                    payload.get("customerName").toString()
            );

            // ✅ Customer Phone
            booking.setCustomerPhone(
                    payload.get("customerPhone").toString()
            );

            // ✅ Pickup Location
            booking.setPickupLocation(
                    payload.get("pickupLocation").toString()
            );

            // ✅ Drop Location
            booking.setDropLocation(
                    payload.get("dropLocation").toString()
            );

            // ✅ Scheduled Date
            String scheduledDate =
                    payload.get("scheduledDate").toString();

            booking.setScheduledDate(
                    LocalDateTime.parse(scheduledDate)
            );

            // ✅ Vehicle ID
            Integer vehicleId =
                    Integer.valueOf(
                            payload.get("vehicleId").toString()
                    );

            // ✅ Save Booking
            Booking savedBooking =
                    bookingService.createBookingWithVehicleId(
                            booking,
                            vehicleId
                    );

            // ✅ Send Email (DO NOT FAIL BOOKING IF EMAIL FAILS)
            try {

                emailService.sendBookingNotificationToAdmin(
                        savedBooking
                );

            } catch (Exception mailError) {

                System.out.println(
                        "EMAIL FAILED BUT BOOKING SAVED"
                );

                mailError.printStackTrace();
            }

            // ✅ SUCCESS RESPONSE
            return ResponseEntity.ok(savedBooking);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body("Booking Error: " + e.getMessage());
        }
    }
}
