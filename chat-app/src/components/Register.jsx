import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Register = () => {
    const url = "http://localhost:8080/auth/register";

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onResgiterSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !username) {
            alert("Please Fill All the Details");
            return;
        }
        try {
            const response = await axios.post(url,
                { username, email, password });
            const data = response.data;

            if (data === "User Successfully registered") {
                navigate("/");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response?.status === 401) {
                alert(error.response.data || "Session expired");
                localStorage.removeItem("token");
            } else {
                alert("User already registered with same email");
            }
        }
    }
    return (
        <form className="space-y-4"
            onSubmit={(e) => {
                onResgiterSubmit(e);
            }}
        >

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400
                     transition"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium
                   hover:bg-gray-800 transition mt-6"
            >
                Register
            </button>

        </form>
    );
};

export default Register;
