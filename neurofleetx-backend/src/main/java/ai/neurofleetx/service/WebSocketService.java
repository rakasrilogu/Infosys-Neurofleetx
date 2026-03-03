package ai.neurofleetx.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * ✅ Vehicle updates for DashboardHome.js and TrafficLayer.js
     * Format matches: {id, name, lat, lng, status}
     */
    public void broadcastVehicle(Map<String, Object> vehicleData) {
        try {
            System.out.println("📡 Broadcasting vehicle: " + vehicleData.get("id"));
            messagingTemplate.convertAndSend("/topic/vehicles", vehicleData);
        } catch (Exception e) {
            System.err.println("❌ Error broadcasting vehicle: " + e.getMessage());
        }
    }

    /**
     * ✅ Route updates for RouteOptimization.js  
     * Format matches: {id, routeId, coordinates, distance, duration}
     */
    public void broadcastRoute(Map<String, Object> routeData) {
        try {
            System.out.println("📡 Broadcasting route: " + routeData.get("routeId"));
            messagingTemplate.convertAndSend("/topic/optimized-routes", routeData);
        } catch (Exception e) {
            System.err.println("❌ Error broadcasting route: " + e.getMessage());
        }
    }
}