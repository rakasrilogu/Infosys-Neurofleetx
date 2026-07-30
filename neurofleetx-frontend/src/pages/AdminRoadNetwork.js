import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaRoad } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_URL;

const AdminRoadNetwork = () => {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ sourceCity: "", targetCity: "", distance: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ sourceCity: "", targetCity: "", distance: "" });

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchEdges = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/road-network`, config);
      setEdges(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch road network:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdges();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.sourceCity || !form.targetCity || !form.distance) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/admin/road-network`,
        {
          sourceCity: form.sourceCity.trim().toLowerCase(),
          targetCity: form.targetCity.trim().toLowerCase(),
          distance: parseFloat(form.distance),
        },
        config
      );
      setForm({ sourceCity: "", targetCity: "", distance: "" });
      fetchEdges();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add road edge");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this road edge?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/road-network/${id}`, config);
      fetchEdges();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const startEdit = (edge) => {
    setEditingId(edge.id);
    setEditForm({
      sourceCity: edge.sourceCity,
      targetCity: edge.targetCity,
      distance: edge.distance,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE}/admin/road-network/${editingId}`,
        {
          sourceCity: editForm.sourceCity.trim().toLowerCase(),
          targetCity: editForm.targetCity.trim().toLowerCase(),
          distance: parseFloat(editForm.distance),
        },
        config
      );
      setEditingId(null);
      fetchEdges();
    } catch (err) {
      alert("Failed to update");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading road network...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FaRoad className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-black">ROAD NETWORK</h2>
        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
          {edges.length} edges
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <h3 className="text-sm font-black uppercase text-slate-400 mb-4">Add Road Edge</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500">Source City</label>
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="e.g. mumbai"
              value={form.sourceCity}
              onChange={(e) => setForm({ ...form, sourceCity: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Target City</label>
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="e.g. pune"
              value={form.targetCity}
              onChange={(e) => setForm({ ...form, targetCity: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Distance (km)</label>
            <input
              type="number"
              step="0.1"
              className="w-full border p-3 rounded-xl"
              placeholder="e.g. 150"
              value={form.distance}
              onChange={(e) => setForm({ ...form, distance: e.target.value })}
              required
            />
          </div>
          <button className="bg-blue-600 text-white font-bold rounded-xl p-3 flex items-center justify-center gap-2">
            <FaPlus /> Add Edge
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-400">
            <tr>
              <th className="p-5">ID</th>
              <th className="p-5">Source City</th>
              <th className="p-5">Target City</th>
              <th className="p-5">Distance (km)</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {edges.map((edge) => (
              <tr key={edge.id} className="border-b hover:bg-slate-50">
                {editingId === edge.id ? (
                  <EditRow
                    editForm={editForm}
                    setEditForm={setEditForm}
                    handleUpdate={handleUpdate}
                    setEditingId={setEditingId}
                  />
                ) : (
                  <>
                    <td className="p-5 font-bold text-slate-400">#{edge.id}</td>
                    <td className="p-5 font-bold">{edge.sourceCity}</td>
                    <td className="p-5 font-bold">{edge.targetCity}</td>
                    <td className="p-5">{edge.distance} km</td>
                    <td className="p-5 text-right space-x-4">
                      <button
                        className="text-blue-600 font-bold"
                        onClick={() => startEdit(edge)}
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        className="text-red-400 font-bold"
                        onClick={() => handleDelete(edge.id)}
                      >
                        <FaTrash className="inline mr-1" />
                        Remove
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {edges.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No road edges configured. Add some above to enable DB-based routing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-800 mb-2">How Route Optimization Works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Routes between cities in this table use the fast Dijkstra algorithm.</li>
          <li>2. Any city pair NOT in this table is resolved via the OSRM routing API (real road distances).</li>
          <li>3. OSRM requires internet and covers the entire world.</li>
          <li>4. Add frequently used routes here for faster responses.</li>
        </ul>
      </div>
    </div>
  );
};

const EditRow = ({ editForm, setEditForm, handleUpdate, setEditingId }) => (
  <>
    <td className="p-5 font-bold text-slate-400">Editing...</td>
    <td className="p-5">
      <input
        className="border p-2 rounded-lg w-full"
        value={editForm.sourceCity}
        onChange={(e) => setEditForm({ ...editForm, sourceCity: e.target.value })}
      />
    </td>
    <td className="p-5">
      <input
        className="border p-2 rounded-lg w-full"
        value={editForm.targetCity}
        onChange={(e) => setEditForm({ ...editForm, targetCity: e.target.value })}
      />
    </td>
    <td className="p-5">
      <input
        type="number"
        step="0.1"
        className="border p-2 rounded-lg w-full"
        value={editForm.distance}
        onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
      />
    </td>
    <td className="p-5 text-right space-x-3">
      <button
        className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg"
        onClick={handleUpdate}
      >
        SAVE
      </button>
      <button
        className="text-slate-400 text-xs font-bold"
        onClick={() => setEditingId(null)}
      >
        CANCEL
      </button>
    </td>
  </>
);

export default AdminRoadNetwork;
