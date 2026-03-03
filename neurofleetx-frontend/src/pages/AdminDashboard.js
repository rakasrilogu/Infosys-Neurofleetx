import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const API_BASE = "http://localhost:8081/api/admin";

  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    driverName: "",
    status: "IDLE",
    health: 100,
    lat: 11.0168,
    lng: 76.9558
  });

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };

  // ================= FETCH VEHICLES =================
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vehicles`, config);
      setVehicles(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ADD VEHICLE =================
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/vehicles`, newVehicle, config);
      setNewVehicle({
        name: "",
        driverName: "",
        status: "IDLE",
        health: 100,
        lat: 11.0168,
        lng: 76.9558
      });
      fetchData();
    } catch (err) {
      alert("Add failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete Unit?")) return;
    try {
      await axios.delete(`${API_BASE}/vehicles/${id}`, config);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE}/vehicles/${editingVehicle.id}`,
        editingVehicle,
        config
      );
      setVehicles(prev =>
        prev.map(v => (v.id === editingVehicle.id ? res.data : v))
      );
      setIsModalOpen(false);
    } catch {
      alert("Update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="ml-64 p-10 w-full">
        <h1 className="text-3xl font-black mb-8">FLEET COMMAND</h1>

        {/* ================= ADD FORM ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <form onSubmit={handleAdd} className="grid grid-cols-5 gap-4">
            <input
              className="border p-3 rounded-xl"
              placeholder="Unit Name"
              value={newVehicle.name}
              onChange={e =>
                setNewVehicle({ ...newVehicle, name: e.target.value })
              }
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Driver Name"
              value={newVehicle.driverName}
              onChange={e =>
                setNewVehicle({ ...newVehicle, driverName: e.target.value })
              }
              required
            />

            <select
              className="border p-3 rounded-xl font-bold"
              value={newVehicle.status}
              onChange={e =>
                setNewVehicle({ ...newVehicle, status: e.target.value })
              }
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IDLE">IDLE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>

            <input
              type="number"
              className="border p-3 rounded-xl"
              placeholder="Health %"
              value={newVehicle.health}
              onChange={e =>
                setNewVehicle({ ...newVehicle, health: e.target.value })
              }
            />

            <button className="bg-blue-600 text-white font-bold rounded-xl">
              DEPLOY
            </button>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-400">
              <tr>
                <th className="p-5">Unit</th>
                <th className="p-5">Status</th>
                <th className="p-5">Health</th>
                <th className="p-5">Pilot</th>
                <th className="p-5 text-right">Control</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="border-b hover:bg-slate-50">
                  <td className="p-5 font-bold">
                    {v.name} <span className="text-slate-300">#{v.id}</span>
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        v.status === "AVAILABLE"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : v.status === "IDLE"
                          ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  {/* HEALTH */}
                  <td className="p-5">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          v.health < 40
                            ? "bg-red-500"
                            : v.health < 70
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${v.health}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold ml-1">
                      {v.health}%
                    </span>
                  </td>

                  <td className="p-5">{v.driverName}</td>

                  <td className="p-5 text-right space-x-4">
                    <button
                      className="text-blue-600 font-bold"
                      onClick={() => {
                        setEditingVehicle({ ...v });
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-400 font-bold"
                      onClick={() => handleDelete(v.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-3xl w-96 flex flex-col gap-4"
          >
            <h2 className="text-xl font-black">
              Edit Unit {editingVehicle.id}
            </h2>

            <input
              className="border p-3 rounded-xl"
              value={editingVehicle.name}
              onChange={e =>
                setEditingVehicle({
                  ...editingVehicle,
                  name: e.target.value
                })
              }
            />

            <input
              className="border p-3 rounded-xl"
              value={editingVehicle.driverName}
              onChange={e =>
                setEditingVehicle({
                  ...editingVehicle,
                  driverName: e.target.value
                })
              }
            />

            <select
              className="border p-3 rounded-xl font-bold"
              value={editingVehicle.status}
              onChange={e =>
                setEditingVehicle({
                  ...editingVehicle,
                  status: e.target.value
                })
              }
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IDLE">IDLE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>

            {/* HEALTH EDIT */}
            <input
              type="number"
              className="border p-3 rounded-xl"
              value={editingVehicle.health}
              onChange={e =>
                setEditingVehicle({
                  ...editingVehicle,
                  health: e.target.value
                })
              }
            />

            <button className="bg-blue-600 text-white p-3 rounded-xl font-bold">
              SAVE CHANGES
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 text-sm"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;