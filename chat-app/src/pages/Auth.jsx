import Login from "../components/Login";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const notAccountClicking=(e)=>{
e.preventDefault();
navigate("/register")
    }
    const navigate = useNavigate();
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CH</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ChatHub</h1>
          <p className="text-gray-500 mt-2">Welcome back!</p>
        </div>

        {/* Login Form */}
       <Login/>

        {/* Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?
            <button
            onClick={(e)=>{
notAccountClicking(e)
            }}
              type="button"
              className="text-blue-500 font-semibold ml-2 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
