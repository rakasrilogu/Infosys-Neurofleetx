package ai.neurofleetx.config;

import ai.neurofleetx.model.RoadNetwork;
import ai.neurofleetx.model.User;
import ai.neurofleetx.repository.RoadNetworkRepository;
import ai.neurofleetx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoadNetworkRepository roadNetworkRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ===============================
        // 1️⃣ Initialize Admin User
        // ===============================

        if (userRepository.findByEmail("admin@neurofleetx.com").isEmpty()) {

            String defaultPassword = System.getenv("DEFAULT_ADMIN_PASSWORD");

            if (defaultPassword == null || defaultPassword.isEmpty()) {
                defaultPassword = "admin123"; // fallback for local dev
            }

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@neurofleetx.com");
            admin.setPassword(passwordEncoder.encode(defaultPassword));
            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println("✅ Admin user initialized.");
        }

        // ===============================
        // 2️⃣ Initialize Road Network
        // ===============================

        if (roadNetworkRepository.count() == 0) {

            System.out.println("🌱 Seeding Road Network...");

            roadNetworkRepository.saveAll(Arrays.asList(
                    new RoadNetwork("mumbai", "pune", 150.0),
                    new RoadNetwork("pune", "bangalore", 840.0),
                    new RoadNetwork("mumbai", "ahmedabad", 530.0),
                    new RoadNetwork("ahmedabad", "jaipur", 670.0),
                    new RoadNetwork("jaipur", "delhi", 270.0)
            ));

            System.out.println("✅ Road Network Loaded.");
        }
    }
}