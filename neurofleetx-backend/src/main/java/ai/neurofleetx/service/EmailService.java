package ai.neurofleetx.service;

import ai.neurofleetx.model.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${ADMIN_EMAIL:rakasrilogu@gmail.com}")
    private String adminEmail;

    public void sendBookingNotificationToAdmin(Booking booking) {
        sendEmail(adminEmail, "🚗 Admin Alert: New Booking #" + booking.getBookingId(), buildAdminBody(booking));
    }

    public void sendBookingConfirmationToCustomer(Booking booking) {
        if (booking.getEmail() == null || booking.getEmail().isEmpty()) {
            logger.warn("No customer email provided for booking #{}, skipping customer notification.", booking.getBookingId());
            return;
        }
        sendEmail(booking.getEmail(), "Booking Confirmed #" + booking.getBookingId(), buildCustomerBody(booking));
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            logger.info("Mail sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error sending email to {}: {}", to, e.getMessage(), e);
        }
    }

    private String buildAdminBody(Booking booking) {
        return "<html><body style='font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;'>" +
               "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>" +
               "<h2 style='color: #dc2626; margin-top: 0;'>🚗 New Booking Alert</h2>" +
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
               "<h2 style='color: #16a34a; margin-top: 0;'>✅ Booking Confirmed!</h2>" +
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
