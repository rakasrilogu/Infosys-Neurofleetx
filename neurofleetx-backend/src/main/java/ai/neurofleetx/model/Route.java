package ai.neurofleetx.model;

import jakarta.persistence.*;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pathJson;
    private Double distance;
    private Double duration;

    public Route() {}
    public Route(String path, Double dist, Double dur) {
        this.pathJson = path; this.distance = dist; this.duration = dur;
    }
    // Getters and Setters
    public Long getId() { return id; }
    public String getPathJson() { return pathJson; }
    public void setPathJson(String p) { this.pathJson = p; }
    public Double getDistance() { return distance; }
    public void setDistance(Double d) { this.distance = d; }
    public Double getDuration() { return duration; }
    public void setDuration(Double d) { this.duration = d; }
}