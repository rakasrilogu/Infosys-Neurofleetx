package ai.neurofleetx;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling
public class NeurofleetxApplication {

    private static final Logger logger = LoggerFactory.getLogger(NeurofleetxApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(NeurofleetxApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    CommandLineRunner checkEmailConfig(
            @Value("${resend.api.key:}") String resendApiKey,
            @Value("${app.email.from:}") String fromEmail,
            @Value("${app.admin.email:}") String adminEmail) {
        return args -> {
            if (resendApiKey == null || resendApiKey.isEmpty() || resendApiKey.contains("${")) {
                logger.error("========== EMAIL NOT CONFIGURED ==========");
                logger.error("Set RESEND_API_KEY env var on Render!");
                logger.error("Sign up at https://resend.com for a free API key.");
                logger.error("Without this, booking emails will NOT be sent.");
                logger.error("===========================================");
            } else {
                logger.info("Email configured: from={}, admin={}", fromEmail, adminEmail);
            }
        };
    }
}
