import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ProfileSidebar = ({ onClose, user, onUserUpdate }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [editUsername, setEditUsername] = useState(user?.userName ?? "");
    const [editAbout, setEditAbout] = useState(user?.about || "Hey there! I'm using ChatHub");
const navigate =useNavigate()
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:8080/api/users/me",
                {
                    userName: editUsername,
                    about: editAbout,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state with response
            if (response.data) {
                setIsEditingName(false);
                setIsEditingAbout(false);
                // Notify parent component to refresh user data
                if (onUserUpdate) {
                    onUserUpdate(response.data);
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(error.response.data || "Session expired");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                console.error("Error updating profile:", error);
                toast.error("Failed to update profile");
            }
        }
    };

    return (
        <div className="w-full md:w-80 h-full flex flex-col"
            style={{ backgroundColor: "hsl(0 0% 100%)" }}>
            {/* Header */}
            <div className="h-14 flex items-center gap-4 px-4 border-b"
                style={{ borderColor: "hsl(0 0% 92%)" }}>
                <button onClick={onClose} className="p-1.5 rounded-full transition-colors duration-200"
                    style={{ color: "hsl(0 0% 30%)" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 95%)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="font-semibold text-lg" style={{ color: "hsl(0 0% 10%)" }}>Profile</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Avatar */}
                <div className="flex justify-center py-8">
                    <div className="w-36 h-36 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "hsl(0 0% 90%)" }}>
                        <span className="text-5xl font-light" style={{ color: "hsl(0 0% 35%)" }}>{editUsername?.charAt(0) || user?.userName?.charAt(0)}</span>
                    </div>
                </div>

                {/* Name */}
                <div className="mx-4 rounded-xl p-4 mb-2"
                    style={{ backgroundColor: "hsl(0 0% 97%)" }}>
                    <p className="text-xs mb-1" style={{ color: "hsl(0 0% 55%)" }}>Your Name</p>
                    <div className="flex justify-between items-center">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="flex-1 px-2 py-1 rounded border text-sm outline-none"
                                style={{ borderColor: "hsl(0 0% 80%)" }}
                                autoFocus
                            />
                        ) : (
                            <p className="text-base font-medium" style={{ color: "hsl(0 0% 10%)" }}>{editUsername}</p>
                        )}
                        <button onClick={() => {
                            if (isEditingName) {
                                handleSaveProfile();
                            } else {
                                setIsEditingName(true);
                            }
                        }} style={{ color: "hsl(0 0% 55%)" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "hsl(0 0% 20%)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "hsl(0 0% 55%)"}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="px-6 py-2 text-xs" style={{ color: "hsl(0 0% 60%)" }}>
                    This is not your username. This name will be visible to your contacts.
                </p>

                {/* About */}
                <div className="mx-4 rounded-xl p-4"
                    style={{ backgroundColor: "hsl(0 0% 97%)" }}>
                    <p className="text-xs mb-1" style={{ color: "hsl(0 0% 55%)" }}>About</p>
                    <div className="flex justify-between items-center gap-2">
                        {isEditingAbout ? (
                            <textarea
                                value={editAbout}
                                onChange={(e) => setEditAbout(e.target.value)}
                                className="flex-1 px-2 py-1 rounded border text-sm outline-none resize-none"
                                style={{ borderColor: "hsl(0 0% 80%)" }}
                                rows="2"
                                autoFocus
                            />
                        ) : (
                            <p className="text-base" style={{ color: "hsl(0 0% 10%)" }}>{editAbout}</p>
                        )}
                        <button onClick={() => {
                            if (isEditingAbout) {
                                handleSaveProfile();
                            } else {
                                setIsEditingAbout(true);
                            }
                        }} style={{ color: "hsl(0 0% 55%)" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "hsl(0 0% 20%)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "hsl(0 0% 55%)"}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
