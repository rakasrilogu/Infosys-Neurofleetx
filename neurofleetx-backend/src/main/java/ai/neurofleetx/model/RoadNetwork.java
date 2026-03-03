package ai.neurofleetx.model;

import jakarta.persistence.*;

@Entity
@Table(name = "road_network")
public class RoadNetwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sourceCity;
    private String targetCity;
    private Double distance;

    // 1. Default Constructor (Crucial for Hibernate/JPA)
    public RoadNetwork() {}

    // 2. Parameterized Constructor (Fixes the DataInitializer error)
    public RoadNetwork(String sourceCity, String targetCity, Double distance) {
        this.sourceCity = sourceCity;
        this.targetCity = targetCity;
        this.distance = distance;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceCity() { return sourceCity; }
    public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }

    public String getTargetCity() { return targetCity; }
    public void setTargetCity(String targetCity) { this.targetCity = targetCity; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
}