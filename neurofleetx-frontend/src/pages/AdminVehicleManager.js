import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const AdminVehicleManager = () => {
  const API = "http://localhost:8081/api/admin/vehicles";
  const token = localStorage.getItem("token");

  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    driverName: "",
    availabilityStatus: "AVAILABLE",
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(API, { headers: authHeaders });
      const data = await res.json();
      setVehicles(data);
    } catch (e) {
      console.error("Fetch vehicles error", e);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(form),
    });

    fetchVehicles();

    setForm({
      name: "",
      driverName: "",
      availabilityStatus: "AVAILABLE",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete vehicle?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    fetchVehicles();
  };

  return (
    <div className="ml-64 p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Fleet</h2>

      {/* ADD FORM */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="text-xs font-bold text-gray-500">
            VEHICLE NAME
          </label>
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500">
            DRIVER NAME
          </label>
          <input
            className="w-full border p-2 rounded"
            value={form.driverName}
            onChange={(e) =>
              setForm({ ...form, driverName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500">
            STATUS
          </label>
          <select
            className="w-full border p-2 rounded"
            value={form.availabilityStatus}
            onChange={(e) =>
              setForm({
                ...form,
                availabilityStatus: e.target.value,
              })
            }
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="IN_USE">IN_USE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        <button className="bg-red-600 text-white p-2 rounded font-bold hover:bg-red-700 flex items-center justify-center gap-2">
          <FaPlus /> Add Vehicle
        </button>
      </form>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{v.id}</td>
                <td className="p-4 font-bold">{v.name}</td>
                <td className="p-4">{v.driverName}</td>
                <td className="p-4 text-sm">
                  {v.availabilityStatus}
                </td>
                <td className="p-4">
                  <FaTrash
                    className="text-red-400 cursor-pointer"
                    onClick={() => handleDelete(v.id)}
                  />
                </td>
              </tr>
            ))}

            {vehicles.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No vehicles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVehicleManager;
