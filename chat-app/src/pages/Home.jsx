import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-10 text-center">

        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-6">
          <span className="text-gray-700 text-3xl font-semibold">CH</span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome to ChatHub
        </h1>

        <p className="text-gray-500 mt-3">
          Simple. Fast. Real-time conversations.
        </p>

        {/* Buttons */}
        <div className="mt-8 space-y-4">

          <button
            onClick={() => navigate("/auth", { state: { mode: "login" } })}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium
                       hover:bg-gray-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/auth", { state: { mode: "register" } })}
            className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium
                       hover:bg-gray-200 transition"
          >
            Register
          </button>

        </div>

        <p className="text-sm text-gray-400 mt-6">
          Login or register to start chatting
        </p>
      </div>
    </div>
  );
};

export default Home;
