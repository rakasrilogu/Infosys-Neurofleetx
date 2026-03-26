import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const FitBounds = ({ vehicles }) => {
  const map = useMap();
  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);
  return null;
};

const LiveTracking = () => {
  const [vehicles, setVehicles] = useState([]);
  const BASE_LAT = 11.0168;
  const BASE_LNG = 76.9558;

  const fetchFleet = async () => {
    try {
      const res = await axios.get(`${API_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const mappedData = res.data.map((v, index) => {
        const hasGps = v.lat && v.lng && v.lat !== 0;
        return {
          ...v,
          lat: hasGps ? v.lat : BASE_LAT + (index * 0.003),
          lng: hasGps ? v.lng : BASE_LNG + (index * 0.003)
        };
      });

      setVehicles(mappedData);
    } catch (e) {
      console.error("Tracking Error", e);
    }
  };

  useEffect(() => {
    fetchFleet();

    const interval = setInterval(() => {
      setVehicles(prev =>
        prev.map(v => ({
          ...v,
          lat: v.lat + (Math.random() - 0.5) * 0.0004,
          lng: v.lng + (Math.random() - 0.5) * 0.0004
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[BASE_LAT, BASE_LNG]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds vehicles={vehicles} />

      {vehicles.map(v => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={L.divIcon({
            className: "custom-icon",
            html: `<div style="
              background:${v.status === "ACTIVE" ? "#22c55e" : "#3b82f6"};
              width:16px;height:16px;border-radius:50%;
              border:2px solid white;"></div>`
          })}
        >
          <Popup>
            <b>{v.name}</b><br />
            Driver: {v.driverName}<br />
            ID: #{v.id}<br />
            Status: {v.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LiveTracking;
  
    

      


          
              

      
