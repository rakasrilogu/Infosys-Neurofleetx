// src/components/MapView.js
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WebSocketService from "../services/WebSocketService";

export default function MapView({ vehicleId }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!vehicleId) return;

    // Connect WebSocket
    WebSocketService.connect(() => {
      console.log("Connected for route tracking");

      // Subscribe to route updates
      WebSocketService.subscribe(`/topic/route/${vehicleId}`, (route) => {
        if (route && route.coordinates) {
          setRouteCoords(route.coordinates);
        }
      });

      // Request initial route
      WebSocketService.send("/app/request-route", vehicleId);
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, [vehicleId]);

  return (
    <MapContainer center={[11.0168, 76.9558]} zoom={13} style={{ height: "500px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Markers */}
      {routeCoords.map((coord, idx) => (
        <Marker key={idx} position={coord} />
      ))}

      {/* Route Line */}
      {routeCoords.length > 1 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
}
