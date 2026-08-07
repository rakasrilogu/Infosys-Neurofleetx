package ai.neurofleetx.service;

import ai.neurofleetx.model.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Autowired
    private RestTemplate restTemplate;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${app.email.from:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${app.admin.email:rakasrilogu@gmail.com}")
    private String adminEmail;

    public void sendBookingNotificationToAdmin(Booking booking) {
        sendEmail(adminEmail, "Admin Alert: New Booking #" + booking.getBookingId(), buildAdminBody(booking));
    }

    public void sendBookingConfirmationToCustomer(Booking booking) {
        if (booking.getEmail() == null || booking.getEmail().isEmpty()) {
            logger.warn("No customer email provided for booking #{}, skipping customer notification.", booking.getBookingId());
            return;
        }
        sendEmail(booking.getEmail(), "Booking Confirmed #" + booking.getBookingId(), buildCustomerBody(booking));
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        if (resendApiKey == null || resendApiKey.isEmpty() || resendApiKey.contains("${")) {
            logger.error("EMAIL NOT SENT: RESEND_API_KEY is not configured. Set it as an env var on Render.");
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", new String[]{to},
                "subject", subject,
                "html", htmlBody
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Mail sent successfully to: {}", to);
            } else {
                logger.error("Failed to send email to {}: status={}, body={}", to, response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

    private String buildAdminBody(Booking booking) {
        return "<html><body style='font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;'>" +
               "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>" +
               "<h2 style='color: #dc2626; margin-top: 0;'>New Booking Alert</h2>" +
               "<hr style='border: 1px solid #e5e7eb;'>" +
               "<table style='width: 100%; font-size: 15px;'>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Booking ID</td><td style='padding: 8px 0; font-weight: bold;'>#" + booking.getBookingId() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Customer</td><td style='padding: 8px 0; font-weight: bold;'>" + booking.getCustomerName() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Phone</td><td style='padding: 8px 0;'>" + booking.getCustomerPhone() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Email</td><td style='padding: 8px 0;'>" + (booking.getEmail() != null ? booking.getEmail() : "N/A") + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Pickup</td><td style='padding: 8px 0; font-weight: bold;'>" + booking.getPickupLocation() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Drop</td><td style='padding: 8px 0; font-weight: bold;'>" + booking.getDropLocation() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Date</td><td style='padding: 8px 0;'>" + booking.getScheduledDate() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Vehicle</td><td style='padding: 8px 0;'>" + (booking.getVehicle() != null ? booking.getVehicle().getName() : "N/A") + "</td></tr>" +
               "</table>" +
               "</div></body></html>";
    }

    private String buildCustomerBody(Booking booking) {
        return "<html><body style='font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;'>" +
               "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>" +
               "<h2 style='color: #16a34a; margin-top: 0;'>Booking Confirmed!</h2>" +
               "<p style='color: #4b5563;'>Hi <strong>" + booking.getCustomerName() + "</strong>,</p>" +
               "<p style='color: #4b5563;'>Your booking has been confirmed. Here are the details:</p>" +
               "<hr style='border: 1px solid #e5e7eb;'>" +
               "<table style='width: 100%; font-size: 15px;'>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Booking ID</td><td style='padding: 8px 0; font-weight: bold;'>#" + booking.getBookingId() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Pickup</td><td style='padding: 8px 0; font-weight: bold;'>" + booking.getPickupLocation() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Drop</td><td style='padding: 8px 0; font-weight: bold;'>" + booking.getDropLocation() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Date</td><td style='padding: 8px 0;'>" + booking.getScheduledDate() + "</td></tr>" +
               "<tr><td style='padding: 8px 0; color: #6b7280;'>Vehicle</td><td style='padding: 8px 0;'>" + (booking.getVehicle() != null ? booking.getVehicle().getName() : "Assigned Soon") + "</td></tr>" +
               "</table>" +
               "<hr style='border: 1px solid #e5e7eb;'>" +
               "<p style='color: #6b7280; font-size: 13px;'>Thank you for choosing NeuroFleetX. Safe travels!</p>" +
               "</div></body></html>";
    }
}
