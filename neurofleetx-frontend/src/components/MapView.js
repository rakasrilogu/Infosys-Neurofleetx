// src/components/MapView.js
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export default function MapView({ vehicleId }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS("http://localhost:8081/ws");
    stompClient = over(socket);
    stompClient.connect({}, () => {
      // Subscribe to live route updates
      stompClient.subscribe(`/topic/route/${vehicleId}`, (message) => {
        const route = JSON.parse(message.body);
        setRouteCoords(route.coordinates);
      });

      // Request initial route
      stompClient.send("/app/request-route", {}, vehicleId);
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [vehicleId]);

  return (
    <MapContainer center={[0, 0]} zoom={13} style={{ height: "500px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {routeCoords.map((coord, idx) => (
        <Marker key={idx} position={coord}></Marker>
      ))}
      {routeCoords.length > 1 && <Polyline positions={routeCoords} color="blue" />}
    </MapContainer>
  );
}
