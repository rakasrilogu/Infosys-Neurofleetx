import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthCheckPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get fresh token
      
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:8081/api/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVehicles(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load fleet data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health) => {
    if (health < 40) return "#ef4444"; // Red
    if (health < 70) return "#f59e0b"; // Orange
    return "#22c55e"; // Green
  };

  if (loading) return <div style={{ padding: 40 }}>🚀 Loading Fleet Status...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>⚠️ {error}</div>;

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        🚑 Fleet Health Monitor
      </h1>

      <div style={{ display: "flex", gap: 40 }}>
        {/* VEHICLE LIST TABLE */}
        <div style={{ flex: 2, background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: "12px 8px" }}>Vehicle Details</th>
                <th style={{ padding: "12px 8px" }}>Status</th>
                <th style={{ padding: "12px 8px" }}>Health Score</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map(v => (
                  <tr 
                    key={v.id} 
                    onClick={() => setSelectedVehicle(v)} 
                    style={{ 
                        cursor: "pointer", 
                        borderBottom: "1px solid #f1f5f9",
                        backgroundColor: selectedVehicle?.id === v.id ? "#f1f5f9" : "transparent"
                    }}
                  >
                    <td style={{ padding: "12px 8px" }}>
                      <strong>{v.name}</strong><br/>
                      <small style={{ color: "#64748b" }}>ID #{v.id}</small>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                        <span style={{ 
                            padding: "4px 8px", 
                            borderRadius: 4, 
                            fontSize: 12, 
                            background: v.status === "Available" ? "#dcfce7" : "#fee2e2",
                            color: v.status === "Available" ? "#166534" : "#991b1b"
                        }}>
                            {v.status}
                        </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ width: 120, height: 8, background: "#e2e8f0", borderRadius: 5 }}>
                        <div style={{
                          width: `${v.health || 0}%`,
                          height: "100%",
                          background: getHealthColor(v.health || 0),
                          borderRadius: 5,
                          transition: "width 0.5s ease-in-out"
                        }} />
                      </div>
                      <small>{v.health}%</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{ padding: 20, textAlign: "center" }}>No vehicles found in database.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DETAILS PANEL */}
        <div style={{ flex: 1 }}>
          {selectedVehicle ? (
            <div style={{ background: "white", padding: 25, borderRadius: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", position: "sticky", top: 40 }}>
              <h3 style={{ marginTop: 0 }}>{selectedVehicle.name}</h3>
              <hr style={{ border: "0.5px solid #f1f5f9" }} />
              <p><b>Vehicle ID:</b> {selectedVehicle.id}</p>
              <p><b>Primary Driver:</b> {selectedVehicle.driverName || "Not Assigned"}</p>
              <p><b>Current Status:</b> {selectedVehicle.status}</p>
              <div style={{ marginTop: 20, padding: 15, background: "#f8fafc", borderRadius: 8 }}>
                 <p style={{ margin: 0, fontSize: 14 }}><b>Engine Health:</b> {selectedVehicle.health}%</p>
                 <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#64748b" }}>Last checked: Just now</p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", paddingTop: 50 }}>
                Select a vehicle to view detailed diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPage;