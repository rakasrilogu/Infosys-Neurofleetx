import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const navigate = useNavigate();

  const heroImage =
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80";

  const modules = [
    {
      title: "Live Fleet Tracking",
      path: "/live-tracking",
      desc: "Monitor vehicles in real time with GPS, speed, and driver behavior insights.",
      img: "https://img.icons8.com/fluency/96/marker.png",
    },
    {
      title: "Customer Booking",
      path: "/booking",
      desc: "Manage transport orders and assign vehicles to shipments seamlessly.",
      img: "https://img.icons8.com/fluency/96/delivery.png",
    },
    {
      title: "Route Optimization",
      path: "/route-optimization",
      desc: "AI-optimized routes to reduce fuel cost and delivery time.",
      img: "https://img.icons8.com/fluency/96/route.png",
    },
    {
      title: "Fleet Health",
      path: "/health-check",
      desc: "Predictive diagnostics for vehicle maintenance and uptime.",
      img: "https://img.icons8.com/fluency/96/maintenance.png",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.75) 60%, rgba(37,99,235,0.35) 100%), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "60px 40px 120px 40px",
          borderBottomRightRadius: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 900,
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          NeuroFleetX Control Center
        </h1>

        <p
          style={{
            marginTop: 15,
            fontSize: "1.1rem",
            color: "#cbd5f5",
            maxWidth: "750px",
          }}
        >
          Welcome back. Your fleet intelligence platform is running optimally.
          Select a module to manage operations.
        </p>

        {/* KPI BOXES */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <KPI label="Fleet Status" value="Operational" />
          <KPI label="Active Vehicles" value="Live" />
          <KPI label="AI Monitoring" value="Enabled" />
          <KPI label="System Health" value="100%" />
        </div>
      </div>

      {/* MODULE GRID */}
      <div
        style={{
          padding: "0 40px",
          marginTop: "-60px",
          paddingBottom: "60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 30,
          }}
        >
          {modules.map((m, i) => (
            <div
              key={i}
              onClick={() => navigate(m.path)}
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "35px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all .25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#f1f5f9",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <img src={m.img} alt={m.title} style={{ width: 40, height: 40 }} />
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 12,
                }}
              >
                {m.title}
              </h3>

              <p
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  marginBottom: 25,
                }}
              >
                {m.desc}
              </p>

              <div
                style={{
                  fontWeight: 800,
                  color: "#2563eb",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                }}
              >
                OPEN MODULE →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KPI = ({ label, value }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.15)",
      padding: "15px 30px",
      borderRadius: "16px",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.2)",
      minWidth: "160px",
    }}
  >
    <div
      style={{
        fontSize: "0.75rem",
        color: "#cbd5f5",
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontWeight: 900,
        fontSize: "1.2rem",
        color: "white",
      }}
    >
      {value}
    </div>
  </div>
);

export default DashboardHome;