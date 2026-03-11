import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import ChatList from "../components/ChatList.jsx";
import ChatView from "../components/ChatView.jsx";
import ChatPlaceholder from "../components/ChatPlaceholder.jsx";
import ProfileSidebar from "../components/ProfileSideBar.jsx";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ENV } from "../../../config.js";

const Dashboard = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = ENV.api_url + "/api/users/me";
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
    const [chats, setChats] = useState([]);

    useEffect(() => {

        const fetchTotalChats = async () => {

            try {
                const url = "http://localhost:8080/chats";
                const token = localStorage.getItem("token");

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChats(response.data);
            }
            catch (error) {
                if (error.response?.status === 401) {
                    toast.error(error.response.data || "Session expired");
                    localStorage.removeItem("token");
                    navigate("/");
                } else {

                    toast.error(error.response.data);
                }
            }

        }
        fetchTotalChats()
    }, []);

useEffect(() => {
    const searchTotalChats = async () => {
      if(!search || search.trim() === ""){
const fetchTotalChats = async () => {

            try {
                const url = "http://localhost:8080/chats";
                const token = localStorage.getItem("token");

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChats(response.data);
            }
            catch (error) {
                if (error.response?.status === 401) {
                    toast.error(error.response.data || "Session expired");
                    localStorage.removeItem("token");
                    navigate("/");
                } else {

                    toast.error(error.response.data);
                }
            }

        }
        fetchTotalChats()
 
      }
        try {
            const url = `http://localhost:8080/friends/search?prefix=${search}`;
            const token = localStorage.getItem("token");
               const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChats(response.data)
        }
        catch(error){
            if (error.response?.status === 401) {
                toast.error(error.response.data || "Session expired");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                toast.error(error.response.data);
            }
        }
    };
    searchTotalChats();
}, [search]);

    const [selectedChat, setSelectedChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);


    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="relative flex-1 flex max-w-7xl w-full mx-auto my-0 md:my-5 overflow-hidden md:rounded-2xl bg-white shadow-lg">

                {/* Profile Sidebar */}
                {showProfile && (
                    <div className="absolute inset-0 z-20 md:relative md:w-[420px] md:border-r md:border-gray-200">
                        <ProfileSidebar user={user} onClose={() => setShowProfile(false)} onUserUpdate={handleUserUpdate} />
                    </div>
                )}

                {/* Left Panel */}
                <div
                    className={`w-full md:w-[420px] flex flex-col border-r border-gray-200 ${selectedChat ? "hidden md:flex" : "flex"
                        } ${showProfile ? "hidden" : ""}`}
                >
                    <Navbar title="ChatHub" isChat={false} />

                    {/* Search row */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                        <button onClick={() => setShowProfile(true)}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
                                <span className="font-medium text-sm text-gray-700">  {user?.userName?.charAt(0)}</span>
                            </div>
                        </button>
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)

                            }}
                            type="text"
                            placeholder="Search or start new chat"
                            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none transition-shadow duration-200 bg-gray-100 text-gray-900 border border-transparent focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <ChatList
                        onSelectChat={(chat) => setSelectedChat(chat)}
                        selectedChatId={selectedChat?.id}
                        chats={chats}
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
                                title={selectedChat.chatName}
                                subtitle={selectedChat.online ? "online" : "last seen recently"}
                                showBackButton={true}
                                onBackClick={() => setSelectedChat(null)}
                                isChat={true}
                            />
                            <ChatView currUser={user.userName} selectedChat={selectedChat} />
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
