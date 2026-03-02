import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import ChatList from "../components/ChatList.jsx";
import ChatView from "../components/ChatView.jsx";
import ChatPlaceholder from "../components/ChatPlaceholder.jsx";
import ProfileSidebar from "../components/ProfileSideBar.jsx";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Dashboard = () => {
    const navigate =useNavigate();
    const [user, setUser] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = "http://localhost:8080/api/users/me";
                const token = localStorage.getItem("token");

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);

            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error(error.response.data || "Session expired");
                    localStorage.removeItem("token");
                    navigate("/");
                } else {
                    console.error("Error fetching user:", error);
                    toast.error("Failed to load user data");
                }
            }
        };

        fetchUser();
    }, []);

    const [selectedChat, setSelectedChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="h-screen flex flex-col" style={{ backgroundColor: "hsl(0 0% 95%)" }}>
            <div className="relative flex-1 flex max-w-7xl w-full mx-auto my-0 md:my-5 overflow-hidden md:rounded-2xl"
                style={{
                    backgroundColor: "hsl(0 0% 100%)",
                    boxShadow: "0 4px 16px hsl(0 0% 0% / 0.08)",
                }}>

                {/* Profile Sidebar */}
                {showProfile && (
                    <div className="absolute inset-0 z-20 md:relative md:w-[420px] md:border-r"
                        style={{ borderColor: "hsl(0 0% 92%)" }}>
                        <ProfileSidebar user={user} onClose={() => setShowProfile(false)} onUserUpdate={handleUserUpdate} />
                    </div>
                )}

                {/* Left Panel */}
                <div
                    className={`w-full md:w-[420px] flex flex-col border-r ${selectedChat ? "hidden md:flex" : "flex"
                        } ${showProfile ? "hidden" : ""}`}
                    style={{ borderColor: "hsl(0 0% 92%)" }}
                >
                    <Navbar title="ChatHub" isChat={false} />

                    {/* Search row */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b"
                        style={{ borderColor: "hsl(0 0% 94%)" }}>
                        <button onClick={() => setShowProfile(true)}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "hsl(0 0% 85%)" }}>
                                <span className="font-medium text-sm" style={{ color: "hsl(0 0% 30%)" }}>  {user?.userName?.charAt(0)}</span>
                            </div>
                        </button>
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none transition-shadow duration-200"
                            style={{
                                backgroundColor: "hsl(0 0% 96%)",
                                color: "hsl(0 0% 10%)",
                                border: "1px solid transparent",
                            }}
                            onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px hsl(0 0% 0% / 0.1)"}
                            onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
                        />
                    </div>

                    <ChatList
                        onSelectChat={(chat) => setSelectedChat(chat)}
                        selectedChatId={selectedChat?.id}
                    />
                </div>

                {/* Right Panel */}
                <div
                    className={`flex-1  flex flex-col ${selectedChat ? "flex" : "hidden md:flex"
                        } ${showProfile ? "hidden md:flex" : ""}`}
                >
                    {selectedChat ? (
                        <>
                            <Navbar
                                title={selectedChat.name}
                                subtitle={selectedChat.online ? "online" : "last seen recently"}
                                showBackButton={true}
                                onBackClick={() => setSelectedChat(null)}
                                isChat={true}
                            />
                            <ChatView />
                        </>
                    ) : (
                        <ChatPlaceholder />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
