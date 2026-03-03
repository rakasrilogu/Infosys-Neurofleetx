package ai.neurofleetx.dto;

public class VehicleDTO {
    private Integer vehicleId;
    private String name;
    private String status;
    private Double lat;
    private Double lng;
    private String driverName;
    private String driverEmail;
    private String availabilityStatus;
    
    // ✅ NEW HEALTH FIELD
    private Integer health;
    
    // Default constructor
    public VehicleDTO() {}
    
    // Constructor with all fields
    public VehicleDTO(Integer vehicleId, String name, String status, Double lat, Double lng, 
                     String driverName, String driverEmail, String availabilityStatus, Integer health) {
        this.vehicleId = vehicleId;
        this.name = name;
        this.status = status;
        this.lat = lat;
        this.lng = lng;
        this.driverName = driverName;
        this.driverEmail = driverEmail;
        this.availabilityStatus = availabilityStatus;
        this.health = health;
    }

    // Getters & Setters
    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) { this.vehicleId = vehicleId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    // ✅ NEW HEALTH GETTERS/SETTERS
    public Integer getHealth() { return health; }
    public void setHealth(Integer health) { this.health = health; }
}

    
    