import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer, TileLayer, Marker, Polyline, Popup, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const API_URL = process.env.REACT_APP_API_URL;

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
          params: { q: cityName, format: "json", limit: 1 },
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
    setStatusMsg("Calculating shortest path...");

    try {
      const token = localStorage.getItem("token");
      const config =
        token && token !== "null"
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

      const payload = {
        startCity: start.trim().toLowerCase(),
        endCity: end.trim().toLowerCase(),
      };

      setStatusMsg("Finding optimal route...");
      const response = await axios.post(`${API_URL}/routes/optimize`, payload, config);

      const cityPath = response.data.path;
      const roadGeometry = response.data.geometry;

      let polylineCoords = [];
      let markers = [];

      if (roadGeometry && roadGeometry.length > 0) {
        // OSRM returned full road geometry - use it for the polyline
        polylineCoords = roadGeometry;

        // Geocode only start and end cities for markers
        setStatusMsg("Mapping start city...");
        const startCoords = await geocodeCity(cityPath[0]);
        setStatusMsg("Mapping end city...");
        const endCoords = await geocodeCity(cityPath[cityPath.length - 1]);

        if (startCoords) markers.push({ name: cityPath[0], coords: startCoords });
        if (endCoords) markers.push({ name: cityPath[cityPath.length - 1], coords: endCoords });
      } else {
        // Dijkstra on DB graph - geocode all path cities for markers and polyline
        const pathWithCoords = [];
        for (let i = 0; i < cityPath.length; i++) {
          const cityName = cityPath[i];
          setStatusMsg(`Mapping city ${i + 1} of ${cityPath.length}: ${cityName}...`);
          const coords = await geocodeCity(cityName);
          if (coords) {
            pathWithCoords.push(coords);
            markers.push({ name: cityName, coords });
          }
        }
        polylineCoords = pathWithCoords;
      }

      if (polylineCoords.length < 2) {
        setError("Could not resolve enough cities on the map. Check city names.");
        setLoading(false);
        setStatusMsg("");
        return;
      }

      setResult({
        pathNames: cityPath,
        polylineCoords,
        markers,
        distance: response.data.distance,
        duration: response.data.duration,
      });
    } catch (err) {
      console.error("Routing Error:", err);
      const msg = err.response?.data?.message || err.message || "Something went wrong.";
      setError(`Route calculation failed: ${msg}`);
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const clearRoute = () => {
    setResult(null);
    setStart("");
    setEnd("");
    setError("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "320px", padding: "20px", background: "#f8f9fa", overflowY: "auto" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Route Optimization</h2>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 16 }}>
          Enter any two cities worldwide. Routes follow actual roads.
        </p>

        <input
          placeholder="Start City (e.g. Chennai)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <input
          placeholder="Destination (e.g. Mumbai)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <button
          onClick={calculateRoute}
          disabled={loading}
          style={{
            width: "100%", padding: "10px", borderRadius: 8,
            background: loading ? "#9ca3af" : "#2563eb",
            color: "white", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Calculating..." : "Find Best Route"}
        </button>
        {result && (
          <button
            onClick={clearRoute}
            style={{
              width: "100%", padding: "10px", marginTop: "10px", borderRadius: 8,
              background: "#e5e7eb", color: "#374151", fontWeight: 700, border: "none",
            }}
          >
            Clear Route
          </button>
        )}

        {loading && (
          <div style={{ marginTop: 16, padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: "0.85rem", color: "#2563eb" }}>
            {statusMsg}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: 12, background: "#fef2f2", borderRadius: 8, fontSize: "0.85rem", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", marginBottom: 12 }}>
              <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 700, marginBottom: 4 }}>ROUTE FOUND</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{result.distance.toFixed(1)} km</div>
              <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>~{result.duration.toFixed(1)} hours</div>
            </div>

            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>PATH:</div>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.8 }}>
              {result.pathNames.map((city, i) => (
                <span key={i}>
                  <span style={{ fontWeight: 700, textTransform: "capitalize" }}>{city}</span>
                  {i < result.pathNames.length - 1 && (
                    <span style={{ color: "#2563eb", margin: "0 6px" }}>{"\u2192"}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ flex: 1 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {result && result.polylineCoords.length > 0 && (
          <>
            <FitBounds coords={result.polylineCoords} />
            <Polyline positions={result.polylineCoords} color="#2563eb" weight={4} opacity={0.8} />
            {result.markers.map((m, idx) => (
              <Marker key={idx} position={m.coords}>
                <Popup>
                  <strong style={{ textTransform: "capitalize" }}>{m.name}</strong>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteOptimization;
