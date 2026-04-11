import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { ENV } from "../../../config.js";

const Login = () => {
    const url = `${ENV.api_url}/auth/login`;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onLoginSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.warning("Email and password required");
            return;
        }

        try {
            const response = await axios.post(url, { email, password });
            const data = response.data;

            if (data === "Failed") {
                toast.error("Invalid email or password");
            } else {
                toast.success("Login successful!");
                localStorage.setItem("token", data); // JWT string
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please check your credentials.");
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
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M3 3l18 18M10.584 10.587a2 2 0 102.828 2.828M9.88 5.09A9.953 9.953 0 0112 4.5c5 0 9.27 3.11 11 7.5a11.827 11.827 0 01-4.043 5.058M6.228 6.228C3.943 7.57 2.19 9.596 1 12c.688 1.39 1.627 2.67 2.773 3.78M9.878 9.879a3 3 0 014.243 4.243"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
                            </svg>
                        )}
                    </button>
                </div>
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
