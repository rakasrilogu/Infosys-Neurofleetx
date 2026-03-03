package ai.neurofleetx.dto;

public class RouteRequest {
    private String startCity;
    private String endCity;

    public RouteRequest() {}
    public RouteRequest(String startCity, String endCity) {
        this.startCity = startCity;
        this.endCity = endCity;
    }

    // Getters and Setters
    public String getStartCity() { return startCity; }
    public void setStartCity(String startCity) { this.startCity = startCity; }
    public String getEndCity() { return endCity; }
    public void setEndCity(String endCity) { this.endCity = endCity; }
}