import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch services
    axios.get("http://localhost:3000/api/services").then((res) => {
      setServices(res.data);
    });

    // Fetch user appointments
    axios
      .get("http://localhost:3000/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        console.log("No appointments yet");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">BookIt</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Services Section */}
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
            >
              <h3 className="text-lg font-semibold text-white">
                {service.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {service.description || "Professional hair service"}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-purple-400 font-bold">
                  R{service.price}
                </span>
                <span className="text-gray-500 text-sm">
                  {service.duration_minutes || service.duration || 60} mins
                </span>
              </div>
              {/* Book Now Button */}
              <a
                href={`/book/${service.id}`}
                className="mt-3 block text-center bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition"
              >
                Book Now
              </a>
            </div>
          ))}
        </div>

        {/* My Appointments Section */}
        <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet. Book one above!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">
                    {apt.slot?.date || "Date TBD"} at {apt.slot?.time || "Time TBD"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Status: {apt.status}
                  </p>
                </div>
                <span className="bg-green-500/10 text-green-400 text-sm px-3 py-1 rounded-full">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}