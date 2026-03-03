package ai.neurofleetx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // <--- THIS ENABLES THE TRIGGER
public class NeurofleetxApplication {
    public static void main(String[] args) {
        SpringApplication.run(NeurofleetxApplication.class, args);
    }
}
