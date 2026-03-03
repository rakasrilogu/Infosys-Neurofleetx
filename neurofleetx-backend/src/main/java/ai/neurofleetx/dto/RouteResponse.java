package ai.neurofleetx.dto;

import java.util.List;

public class RouteResponse {
    private Long id;
    private List<String> path;
    private Double totalDistance;
    private Double estimatedTime;

    public RouteResponse() {}

    public RouteResponse(Long id, List<String> path, Double totalDistance, Double estimatedTime) {
        this.id = id;
        this.path = path;
        this.totalDistance = totalDistance;
        this.estimatedTime = estimatedTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<String> getPath() { return path; }
    public void setPath(List<String> path) { this.path = path; }

    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }

    public Double getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(Double estimatedTime) { this.estimatedTime = estimatedTime; }

    // Aliases so frontend response.data.distance and response.data.duration work
    public Double getDistance() { return totalDistance; }
    public Double getDuration() { return estimatedTime; }
}