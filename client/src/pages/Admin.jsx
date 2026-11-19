import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newSlot, setNewSlot] = useState({ serviceId: "", date: "", time: "" });
  const [autoGen, setAutoGen] = useState({
    serviceId: "",
    startDate: "",
    endDate: "",
    startHour: "8",
    endHour: "17"
  });
  const [message, setMessage] = useState("");
  const [genMessage, setGenMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/services").then((res) => {
      setServices(res.data);
    });
    axios
      .get("http://localhost:3000/api/appointments/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments(res.data);
      });
  }, []);

  const handleAddSlot = async () => {
    try {
      await axios.post("http://localhost:3000/api/slots", newSlot, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Slot added successfully!");
      setNewSlot({ serviceId: "", date: "", time: "" });
    } catch (err) {
      setMessage("❌ Failed to add slot.");
    }
  };

  const handleAutoGenerate = async () => {
    try {
      setGenMessage("Generating slots...");
      const res = await axios.post(
        "http://localhost:3000/api/slots/generate",
        autoGen,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setGenMessage("❌ Failed to generate slots.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Manage your booking system</p>
          </div>
          <a href="/dashboard" className="text-purple-400 hover:underline text-sm">
            ← Back to Dashboard
          </a>
        </div>

        {/* Auto Generate Slots */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold mb-1">Auto-Generate Slots</h2>
          <p className="text-gray-400 text-sm mb-6">
            Automatically create slots for a date range based on service duration.
            Skips weekends automatically.
          </p>

          {genMessage && (
            <p className="bg-purple-500/10 text-purple-400 p-3 rounded-lg mb-4 text-sm">
              {genMessage}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Service</label>
              <select
                value={autoGen.serviceId}
                onChange={(e) => setAutoGen({ ...autoGen, serviceId: e.target.value })}
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} mins)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={autoGen.startDate}
                  onChange={(e) => setAutoGen({ ...autoGen, startDate: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">End Date</label>
                <input
                  type="date"
                  value={autoGen.endDate}
                  onChange={(e) => setAutoGen({ ...autoGen, endDate: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Start Hour (e.g. 8 = 8am)
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={autoGen.startHour}
                  onChange={(e) => setAutoGen({ ...autoGen, startHour: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  End Hour (e.g. 17 = 5pm)
                </label>
                <input
                  type="number"
                  min="6"
                  max="22"
                  value={autoGen.endHour}
                  onChange={(e) => setAutoGen({ ...autoGen, endHour: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                />
              </div>
            </div>

            <button
              onClick={handleAutoGenerate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Generate Slots Automatically
            </button>
          </div>
        </div>

        {/* Manual Add Slot */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold mb-4">Add Single Slot Manually</h2>

          {message && (
            <p className="bg-purple-500/10 text-purple-400 p-3 rounded-lg mb-4 text-sm">
              {message}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            <select
              value={newSlot.serviceId}
              onChange={(e) => setNewSlot({ ...newSlot, serviceId: e.target.value })}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
            />

            <input
              type="time"
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
            />

            <button
              onClick={handleAddSlot}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Add Single Slot
            </button>
          </div>
        </div>

        {/* All Appointments */}
        <h2 className="text-xl font-bold mb-4">
          All Appointments ({appointments.length})
        </h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">
                    {apt.user?.name} — {apt.slot?.date} at {apt.slot?.time}
                  </p>
                  <p className="text-gray-400 text-sm">{apt.user?.email}</p>
                </div>
                <span className="bg-green-500/10 text-green-400 text-sm px-3 py-1 rounded-full">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}