import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || JSON.stringify(data) || "Register failed");
      return;
    }

    
    localStorage.setItem("userName", data.name || name);
    localStorage.setItem("userEmail", data.email || email);

    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend. Is Flask running on port 5000?");
  }
};

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen flex items-center justify-center">
      <div className="bg-[#1A1A2E] border border-[#2A2A3D] p-8 rounded-xl w-[90%] max-w-md">
        <h1 className="text-white text-2xl font-bold text-center">FocusFlow</h1>
        <p className="text-[#9CA3AF] text-center mb-6">Create your account</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]"
          />
          <button className="bg-[#22D3EE] text-black font-bold p-3 rounded">
            Register
          </button>
        </form>

        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#22D3EE]">Login</Link>
        </p>
      </div>
    </div>
  );
}