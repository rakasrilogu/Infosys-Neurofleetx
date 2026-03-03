package ai.neurofleetx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime; // Added this import

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; 

    private String name;
    private String status; 
    private Double lat;
    private Double lng;
    private String driverName;
    private String driverEmail;
    private String availabilityStatus; 
    private Integer health; 

    // ✅ ADD THESE FIELDS
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ ADD THIS METHOD (Automates the timestamp)
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}