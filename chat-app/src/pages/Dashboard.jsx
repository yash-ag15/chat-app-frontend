
import { useCallback, useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import ChatList from "../components/ChatList.jsx";
import ChatView from "../components/ChatView.jsx";
import ChatPlaceholder from "../components/ChatPlaceholder.jsx";
import ProfileSidebar from "../components/ProfileSideBar.jsx";
import GroupChatCreator from "../components/GroupChatCreator.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ENV } from "../../../config.js";
import { connectWebSocket, getStompClient } from "../services/webscoket";


const Dashboard = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const selectedChatRef = useRef(null);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    const loadChats = useCallback(async () => {
        try {
            const url = `${ENV.api_url}/chats`;
            const token = localStorage.getItem("token");

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setChats(response.data.map(chat => ({ ...chat, unreadCount: 0 })));
        }
        catch (error) {
            if (error.response?.status === 401) {
                toast.error(error.response.data || "Session expired");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                toast.error(error.response?.data || "Failed to load chats");
            }
        }
    }, [navigate]);

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
    }, [navigate]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    useEffect(() => {
        const searchTotalChats = async () => {
            if (!search || search.trim() === "") {
                loadChats();
                return;
            }
            try {
                const url = `${ENV.api_url}/friends/search?prefix=${search}`;
                const token = localStorage.getItem("token");
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChats(
                    response.data.map(chat => ({
                        ...chat,
                        unreadCount: 0
                    }))
                );
            }
            catch (error) {
                if (error.response?.status === 401) {
                    toast.error(error.response.data || "Session expired");
                    localStorage.removeItem("token");
                    navigate("/");
                } else {
                    toast.error(error.response?.data || "Failed to search chats");
                }
            }
        };
        searchTotalChats();
    }, [loadChats, navigate, search]);


    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };


    useEffect(() => {

        let subscription;

        if (!user?.email) return;

        connectWebSocket(() => {

            const client = getStompClient();


            const waitForConnection = () => {
                if (client && client.connected) {

                    subscription = client.subscribe(
                        `/topic/chat-list/${user.email}`,
                        (message) => {

                            const data = JSON.parse(message.body);

                            setChats(prevChats => {

                                const exists = prevChats.some(
                                    chat => chat.chatId === data.chatId
                                );

                                let updatedChats;

                                if (exists) {

                                    updatedChats = prevChats.map(chat => {

                                        if (chat.chatId !== data.chatId) return chat;

                                        const isOpenChat =
                                            selectedChatRef.current?.chatId === data.chatId;

                                        const isMe =
                                            data.senderName === user.email;

                                        return {
                                            ...chat,
                                            lastMessage: data.imageUrl
                                                ? "📷 Photo"
                                                : data.lastMessage,
                                            lastMessageTime: data.lastMessageTime,

                                            unreadCount: isMe
                                                ? 0
                                                : isOpenChat
                                                    ? 0
                                                    : (chat.unreadCount || 0) + 1
                                        };
                                    });

                                } else {

                                    const newChat = {
                                        chatId: data.chatId,
                                        chatName: data.sender || "User",
                                      lastMessage: data.imageUrl
                                                ? "📷 Photo"
                                                : data.lastMessage,
                                        lastMessageTime: data.lastMessageTime,
                                        unreadCount: 1,


                                        isGroup: false,
                                        online: false
                                    };

                                    updatedChats = [newChat, ...prevChats];
                                }

                                const updated = updatedChats.find(
                                    c => c.chatId === data.chatId
                                );
                                const others = updatedChats.filter(
                                    c => c.chatId !== data.chatId
                                );

                                return updated ? [updated, ...others] : updatedChats;
                            });
                        }
                    );

                } else {

                    setTimeout(waitForConnection, 100);
                }
            };

            waitForConnection();
        });

        return () => {
            subscription?.unsubscribe();
        };

    }, [user]);

    useEffect(() => {

        if (!user?.userName) return;

        const client = getStompClient();

        let sub1, sub2;

        const wait = () => {
            if (client && client.connected) {

                sub1 = client.subscribe(
                    `/topic/initial-presence/${user.userName}`,
                    (msg) => {
                        const onlineUsers = JSON.parse(msg.body);

                        setChats(prev =>
                            prev.map(chat => ({
                                ...chat,
                                online: onlineUsers.includes(chat.chatName)
                            }))
                        );
                    }
                );

                sub2 = client.subscribe("/topic/presence", (msg) => {
                    const data = JSON.parse(msg.body);

                    setChats(prev =>
                        prev.map(chat => {
                            if (chat.isGroup) return chat;
                            if (chat.chatName !== data.userName) return chat;

                            return {
                                ...chat,
                                online: data.online
                            };
                        })
                    );
                });

            } else {
                setTimeout(wait, 100);
            }
        };

        wait();

        return () => {
            sub1?.unsubscribe();
            sub2?.unsubscribe();
        };

    }, [user]);

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
                                {user?.profilePhotoUrl ? (
                                    <img
                                        src={user.profilePhotoUrl}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.userName?.charAt(0)}
                                    </span>
                                )}

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

                    <GroupChatCreator
                        onGroupCreated={(newGroupChat) => {
                            loadChats();
                            if (newGroupChat?.chatId) {
                                setSelectedChat(newGroupChat);
                            }
                        }}
                    />

                    <ChatList
                        onSelectChat={(chat) => {
                            setSelectedChat(chat);


                            setChats(prev =>
                                prev.map(c =>
                                    c.chatId === chat.chatId
                                        ? { ...c, unreadCount: 0 }
                                        : c
                                )
                            );
                        }}
                        selectedChatId={selectedChat?.chatId}
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