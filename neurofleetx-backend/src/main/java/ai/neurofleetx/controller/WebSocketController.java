package ai.neurofleetx.controller;

import ai.neurofleetx.service.WebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.util.Map;
import java.util.HashMap;

@Controller
public class WebSocketController {

    private final WebSocketService webSocketService;

    public WebSocketController(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    // ✅ Test WebSocket connection
    @MessageMapping("/test")
    @SendTo("/topic/test")
    public Map<String, String> testConnection(@Payload String message, Principal principal) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Echo: " + message);
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }

    // ✅ Handle vehicle updates - broadcasts to DashboardHome.js and TrafficLayer.js
    @MessageMapping("/updateVehicle")
    public void updateVehicle(@Payload Map<String, Object> vehicleData, Principal principal) {
        try {
            System.out.println("📨 Vehicle update: " + vehicleData);
            webSocketService.broadcastVehicle(vehicleData);
        } catch (Exception e) {
            System.err.println("❌ Error updating vehicle: " + e.getMessage());
        }
    }

    // ✅ Handle route optimization - broadcasts to RouteOptimization.js
    @MessageMapping("/optimizeRoute")
    public void optimizeRoute(@Payload Map<String, Object> routeRequest, Principal principal) {
        try {
            System.out.println("📨 Route optimization: " + routeRequest);
            
            // Create sample optimized route response
            Map<String, Object> optimizedRoute = new HashMap<>();
            optimizedRoute.put("routeId", "route_" + System.currentTimeMillis());
            optimizedRoute.put("distance", 25.5);
            optimizedRoute.put("duration", 30.0);
            optimizedRoute.put("timestamp", System.currentTimeMillis());
            
            webSocketService.broadcastRoute(optimizedRoute);
        } catch (Exception e) {
            System.err.println("❌ Error optimizing route: " + e.getMessage());
        }
    }
}