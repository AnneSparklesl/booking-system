import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Book() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [service, setService] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`http://localhost:3000/api/services/${serviceId}`).then((res) => {
      setService(res.data);
    });
    axios.get(`http://localhost:3000/api/slots/${serviceId}`).then((res) => {
      setSlots(res.data);
    });
  }, [serviceId]);

  const handleBook = async (slotId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/appointments/book",
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Appointment booked successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setMessage("Failed to book. Slot may already be taken.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-purple-400 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {service && (
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
            <h1 className="text-2xl font-bold">{service.name}</h1>
            <p className="text-gray-400 mt-1">{service.description}</p>
            <div className="flex gap-6 mt-4">
              <span className="text-purple-400 font-bold text-lg">R{service.price}</span>
              <span className="text-gray-500">{service.duration} mins</span>
            </div>
          </div>
        )}

        {message && (
          <p className="bg-purple-500/10 text-purple-400 p-3 rounded-lg mb-6">
            {message}
          </p>
        )}

        <h2 className="text-xl font-bold mb-4">Available Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-500">No available slots for this service.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800"
              >
                <p className="text-white font-semibold">{slot.date}</p>
                <p className="text-gray-400 text-sm">{slot.time}</p>
                <button
                  onClick={() => handleBook(slot.id)}
                  className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition"
                >
                  Book This Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}