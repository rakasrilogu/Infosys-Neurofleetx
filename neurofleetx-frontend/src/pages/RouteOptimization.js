import React, { useState } from "react";
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

const API_URL = process.env.REACT_APP_API_URL;

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

      const config =
        token && token !== "null"
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

      const payload = {
        startCity: start.trim().toLowerCase(),
        endCity: end.trim().toLowerCase(),
      };

      // ✅ FIXED URL HERE
      const response = await axios.post(
        `${API_URL}/routes/optimize`,
        payload,
        config
      );

      const cityPath = response.data.path;
      const pathWithCoords = [];
      const failedCities = [];

      for (let i = 0; i < cityPath.length; i++) {
        const cityName = cityPath[i];
        setStatusMsg(
          `Mapping city ${i + 1} of ${cityPath.length}: ${cityName}...`
        );

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
        setError("Could not resolve enough cities on the map.");
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
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
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
      <div style={{ width: "300px", padding: "20px", background: "#f8f9fa" }}>
        <h2>NeuroFleetX Route Optimization</h2>

        <input
          placeholder="Start City"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Destination"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button onClick={calculateRoute} style={{ width: "100%", padding: "10px" }}>
          Find Best Route
        </button>

        {result && (
          <button
            onClick={clearRoute}
            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          >
            Clear Route
          </button>
        )}

        {loading && <p>{statusMsg}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <p>
            Distance: {result.distance.toFixed(1)} km <br />
            Duration: {result.duration.toFixed(1)} hrs
          </p>
        )}
      </div>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ flex: 1 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {result && result.coords.length > 0 && (
          <>
            <FitBounds coords={result.coords} />
            <Polyline positions={result.coords} color="blue" />
            {result.coords.map((pos, idx) => (
              <Marker key={idx} position={pos}>
                <Popup>Stop #{idx + 1}</Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteOptimization;




          


                  

