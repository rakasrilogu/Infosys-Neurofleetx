package ai.neurofleetx.dto;

public class RouteRequest {
    private String startCity;
    private String endCity;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;

    public RouteRequest() {}

    public RouteRequest(String startCity, String endCity) {
        this.startCity = startCity;
        this.endCity = endCity;
    }

    public String getStartCity() { return startCity; }
    public void setStartCity(String startCity) { this.startCity = startCity; }

    public String getEndCity() { return endCity; }
    public void setEndCity(String endCity) { this.endCity = endCity; }

    public Double getStartLat() { return startLat; }
    public void setStartLat(Double startLat) { this.startLat = startLat; }

    public Double getStartLng() { return startLng; }
    public void setStartLng(Double startLng) { this.startLng = startLng; }

    public Double getEndLat() { return endLat; }
    public void setEndLat(Double endLat) { this.endLat = endLat; }

    public Double getEndLng() { return endLng; }
    public void setEndLng(Double endLng) { this.endLng = endLng; }
}
