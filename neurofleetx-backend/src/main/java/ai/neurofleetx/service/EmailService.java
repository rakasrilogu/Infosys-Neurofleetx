package ai.neurofleetx.service;

import ai.neurofleetx.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.driver.email}")
    private String driverEmail;

    private static final String ADMIN_EMAIL = "rakasrilogu@gmail.com";

    public void sendBookingNotificationToAdmin(Booking booking) {
        sendEmail(ADMIN_EMAIL, "🚗 Admin Alert: New Booking #" + booking.getBookingId(), buildBody(booking, "ADMIN"));
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
            System.out.println("✅ Mail sent to: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Mail Error: " + e.getMessage());
        }
    }

    private String buildBody(Booking booking, String role) {
        return "<html><body style='font-family: Arial; padding: 20px;'>" +
               "<h2>" + role + " NOTIFICATION</h2>" +
               "<p><strong>Customer:</strong> " + booking.getCustomerName() + "</p>" +
               "<p><strong>Pickup:</strong> " + booking.getPickupLocation() + "</p>" +
               "<p><strong>Drop:</strong> " + booking.getDropLocation() + "</p>" +
               "<p><strong>Date:</strong> " + booking.getScheduledDate() + "</p>" +
               "</body></html>";
    }
}