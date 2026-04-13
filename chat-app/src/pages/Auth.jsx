import { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useLocation } from "react-router-dom";

const Auth = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (location.state?.mode === "register") {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/chatlogo.jpg"
                        alt="ChatHub logo"
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                    />

                    <h1 className="text-2xl font-semibold text-gray-900">
                        ChatHub
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {isLogin ? "Welcome back!" : "Create your account"}
                    </p>
                </div>

              
                {isLogin ? <Login /> : <Register />}

            </div>
        </div>
    );
};

export default Auth;
