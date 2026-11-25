import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl font-bold">404</h1>
      <p className="text-[#9CA3AF] my-4">error</p>
      <Link to="/login" className="bg-[#22D3EE] text-black font-bold px-6 py-3 rounded">Go to Login</Link>
    </div>
  );
}