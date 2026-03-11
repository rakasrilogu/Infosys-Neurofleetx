package ai.neurofleetx.config;

import ai.neurofleetx.model.*;
import ai.neurofleetx.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RoadNetworkRepository roadNetworkRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Value("${ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    @Value("${ADMIN_EMAIL:admin@neurofleetx.com}")
    private String adminEmail;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Admin
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Admin Ready.");
        }

        // 2. Initialize Road Network using Repository
        if (roadNetworkRepository.count() == 0) {
            System.out.println("🌱 Seeding Road Network...");
            roadNetworkRepository.saveAll(Arrays.asList(
                new RoadNetwork("mumbai", "pune", 150.0),
                new RoadNetwork("pune", "bangalore", 840.0),
                new RoadNetwork("mumbai", "ahmedabad", 530.0),
                new RoadNetwork("ahmedabad", "jaipur", 670.0),
                new RoadNetwork("jaipur", "delhi", 270.0)
            ));
            System.out.println("✅ Dijkstra Map Loaded.");
        }
    }
}
    
