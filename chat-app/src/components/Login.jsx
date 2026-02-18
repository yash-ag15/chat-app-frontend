import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const url = "http://localhost:8080/auth/login";
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLoginSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        try {
            const response = await axios.post(url, { email, password });
            const data = response.data;

            if (data === "Failed") {
                alert("Invalid email or password");
            } else {
                localStorage.setItem("token", data); // JWT string
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            alert("Enter Valid Credential.");
        }
    };

    return (
        <form className="space-y-4" onSubmit={onLoginSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium
                   hover:bg-gray-800 transition mt-6"
            >
                Login
            </button>
        </form>
    );
};

export default Login;
