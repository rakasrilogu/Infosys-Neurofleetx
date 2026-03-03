import React, { useState, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FitBounds = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    if (coords && coords.length > 1) {
      map.fitBounds(coords, { padding: [40, 40] });
    }
  }, [coords, map]);
  return null;
};

const RouteOptimization = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  const geocodeCity = async (cityName) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: cityName, format: "json", limit: 1, countrycodes: "in" },
          headers: { "User-Agent": "NeuroFleetX_App/1.0 (contact@neurofleetx.com)" },
        }
      );
      if (response.data && response.data.length > 0) {
        const item = response.data[0];
        return [parseFloat(item.lat), parseFloat(item.lon)];
      }
      return null;
    } catch (err) {
      console.error(`Geocoding error for ${cityName}:`, err.message);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!start.trim() || !end.trim()) {
      setError("Please enter both start and end cities.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");
    setStatusMsg("Calculating shortest path via backend...");

    try {
      const token = localStorage.getItem("token");

      // ✅ Fix: never send "Bearer null"
      const config = token && token !== "null"
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const payload = {
        startCity: start.trim().toLowerCase(),
        endCity: end.trim().toLowerCase(),
      };

      const response = await axios.post(
        "http://localhost:8081/api/routes/optimize",
        payload,
        config
      );

      const cityPath = response.data.path;
      const pathWithCoords = [];
      const failedCities = [];

      for (let i = 0; i < cityPath.length; i++) {
        const cityName = cityPath[i];
        setStatusMsg(`Mapping city ${i + 1} of ${cityPath.length}: ${cityName}...`);

        const coords = await geocodeCity(cityName);
        if (coords) {
          pathWithCoords.push(coords);
        } else {
          failedCities.push(cityName);
          pathWithCoords.push(null);
        }

        if (i < cityPath.length - 1) await delay(1000);
      }

      const validCoords = pathWithCoords.filter(Boolean);

      if (validCoords.length < 2) {
        setError("Could not resolve enough cities on the map. Please try again.");
        setLoading(false);
        setStatusMsg("");
        return;
      }

      setResult({
        pathNames: cityPath,
        coordsRaw: pathWithCoords,
        coords: validCoords,
        distance: response.data.distance,
        duration: response.data.duration,
        failedCities,
      });

    } catch (err) {
      console.error("Routing Error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) calculateRoute();
  };

  const clearRoute = () => {
    setResult(null);
    setStart("");
    setEnd("");
    setError("");
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={logoAreaStyle}>
          <h2 style={logoStyle}>NeuroFleetX</h2>
          <p style={subtitleStyle}>Route Optimization Engine</p>
        </div>

        <label style={labelStyle}>Start City</label>
        <input
          style={inputStyle}
          placeholder="e.g. Mumbai"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <label style={labelStyle}>Destination</label>
        <input
          style={inputStyle}
          placeholder="e.g. Delhi"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          style={loading ? btnDisabledStyle : btnStyle}
          onClick={calculateRoute}
          disabled={loading}
        >
          {loading ? "Processing..." : "Find Best Route"}
        </button>

        {result && !loading && (
          <button style={clearBtnStyle} onClick={clearRoute}>
            Clear Route
          </button>
        )}

        {loading && (
          <div style={statusBoxStyle}>
            <p style={statusTextStyle}>{statusMsg}</p>
          </div>
        )}

        {error && <p style={errorStyle}>⚠ {error}</p>}

        {result && (
          <div style={resultBoxStyle}>
            <p style={statsStyle}>
              📍 {result.distance.toFixed(1)} km &nbsp;|&nbsp; ⏱ {result.duration.toFixed(1)} hrs
            </p>
            <div style={pathChainStyle}>
              {result.pathNames.map((name, i) => (
                <span
                  key={i}
                  style={{
                    fontWeight: i === 0 || i === result.pathNames.length - 1 ? "700" : "400",
                    color: i === 0 ? "#28a745" : i === result.pathNames.length - 1 ? "#dc3545" : "#333",
                  }}
                >
                  {name.toUpperCase()}
                  {i < result.pathNames.length - 1 && (
                    <span style={{ color: "#aaa", margin: "0 4px" }}>→</span>
                  )}
                </span>
              ))}
            </div>
            {result.failedCities.length > 0 && (
              <p style={warnStyle}>⚠ Could not map: {result.failedCities.join(", ")}</p>
            )}
          </div>
        )}
      </div>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ flex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {result && result.coords.length > 0 && (
          <>
            <FitBounds coords={result.coords} />
            <Polyline positions={result.coords} color="#007bff" weight={4} opacity={0.75} />
            {result.pathNames.map((name, idx) => {
              const pos = result.coordsRaw[idx];
              if (!pos) return null;
              return (
                <Marker key={idx} position={pos}>
                  <Popup>
                    <strong>{name.toUpperCase()}</strong><br />
                    Stop #{idx + 1}
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

const containerStyle = { display: "flex", height: "100vh", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" };
const sidebarStyle = { width: "300px", minWidth: "300px", padding: "28px 24px", background: "#f8f9fa", borderRight: "1px solid #ddd", zIndex: 1000, overflowY: "auto", boxSizing: "border-box" };
const logoAreaStyle = { marginBottom: "28px" };
const logoStyle = { color: "#007bff", margin: "0 0 4px 0", fontSize: "22px" };
const subtitleStyle = { fontSize: "12px", color: "#888", margin: 0 };
const labelStyle = { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#444" };
const inputStyle = { width: "100%", padding: "11px 12px", marginBottom: "18px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "14px", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "13px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", marginBottom: "10px" };
const btnDisabledStyle = { ...btnStyle, background: "#b0c9f0", cursor: "not-allowed" };
const clearBtnStyle = { ...btnStyle, background: "transparent", color: "#dc3545", border: "1px solid #dc3545", marginBottom: "0" };
const statusBoxStyle = { marginTop: "14px" };
const statusTextStyle = { fontSize: "12px", color: "#007bff", margin: 0 };
const errorStyle = { marginTop: "12px", fontSize: "12px", color: "#dc3545", background: "#fff5f5", padding: "10px", borderRadius: "6px", border: "1px solid #f5c6cb" };
const resultBoxStyle = { marginTop: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" };
const statsStyle = { fontSize: "13px", fontWeight: "600", color: "#333", margin: "0 0 10px 0" };
const pathChainStyle = { fontSize: "12px", lineHeight: "1.9", wordBreak: "break-word" };
const warnStyle = { marginTop: "10px", fontSize: "11px", color: "#856404", background: "#fff3cd", padding: "8px", borderRadius: "4px" };

export default RouteOptimization;