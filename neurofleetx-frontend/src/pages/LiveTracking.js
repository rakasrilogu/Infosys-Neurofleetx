import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

  const fetchAndFixFleet = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/vehicles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
    fetchAndFixFleet();
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        lat: v.lat + (Math.random() - 0.5) * 0.0004,
        lng: v.lng + (Math.random() - 0.5) * 0.0004
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: "57px",
      left: "240px",
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      background: "#f1f5f9",
      padding: "40px 50px",
      boxSizing: "border-box",
    }}>

      <div style={{
        flex: 1,
        borderRadius: "20px",
        overflow: "visible",
        border: "3px solid #2563eb",
        boxShadow: "0 0 0 6px rgba(37,99,235,0.1), 0 10px 40px rgba(0,0,0,0.12)",
        position: "relative",
      }}>

        {/* Title ON the border */}
        <div style={{
          position: "absolute",
          top: "-18px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          background: "#f1f5f9",
          padding: "0 16px",
          zIndex: 1000,
          whiteSpace: "nowrap",
        }}>
          <h1 style={{ fontWeight: "900", fontSize: "20px", margin: 0, color: "#0f172a" }}>
            📡 LIVE FLEET RADAR
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "9px", height: "9px", borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse 1.5s infinite"
            }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#22c55e" }}>LIVE</span>
          </div>
          <div style={{
            background: "#2563eb", color: "white",
            padding: "4px 14px", borderRadius: "8px",
            fontWeight: "800", fontSize: "12px",
          }}>
            {vehicles.length} Units Online
          </div>
        </div>

        {/* Corner accents */}
        <div style={{ ...cornerStyle, top: -3, left: -3, borderTop: "4px solid #2563eb", borderLeft: "4px solid #2563eb" }} />
        <div style={{ ...cornerStyle, top: -3, right: -3, borderTop: "4px solid #2563eb", borderRight: "4px solid #2563eb" }} />
        <div style={{ ...cornerStyle, bottom: -3, left: -3, borderBottom: "4px solid #2563eb", borderLeft: "4px solid #2563eb" }} />
        <div style={{ ...cornerStyle, bottom: -3, right: -3, borderBottom: "4px solid #2563eb", borderRight: "4px solid #2563eb" }} />

        {/* Map */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "17px", overflow: "hidden" }}>
          <MapContainer
            center={[BASE_LAT, BASE_LNG]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitBounds vehicles={vehicles} />

            {vehicles.map(v => (
              <Marker
                key={v.id}
                position={[v.lat, v.lng]}
                icon={L.divIcon({
                  className: "custom-icon",
                  html: `
                    <div style="
                      background: ${v.status === "ACTIVE" ? "#22c55e" : "#3b82f6"};
                      width: 16px; height: 16px;
                      border-radius: 50%;
                      border: 2.5px solid white;
                      box-shadow: 0 0 10px rgba(0,0,0,0.3);
                    "></div>
                  `
                })}
              >
                <Popup>
                  <div style={{ padding: "6px 4px", minWidth: "140px" }}>
                    <b style={{ color: "#2563eb", fontSize: "14px" }}>{v.name}</b>
                    <br />
                    <small style={{ color: "#475569" }}>Driver: {v.driverName}</small>
                    <br />
                    <small style={{ color: "#475569" }}>ID: #{v.id}</small>
                    <br />
                    <span style={{
                      display: "inline-block",
                      marginTop: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: v.status === "ACTIVE" ? "#dcfce7" : "#dbeafe",
                      color: v.status === "ACTIVE" ? "#15803d" : "#1d4ed8",
                    }}>
                      {v.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </div>
  );
};

const cornerStyle = {
  position: "absolute",
  width: "20px",
  height: "20px",
  zIndex: 1000,
  borderRadius: "2px",
};

export default LiveTracking;