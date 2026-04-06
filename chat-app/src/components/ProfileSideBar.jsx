import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ENV } from "../../../config";

const ProfileSidebar = ({ onClose, user, onUserUpdate }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [editUsername, setEditUsername] = useState(user?.userName ?? "");
    const [editAbout, setEditAbout] = useState(user?.about || "Hey there! I'm using ChatHub");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showSaveBtn, setShowSaveBtn] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setShowSaveBtn(true);
        }
    };

    const handleCancelImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setShowSaveBtn(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        window.location.href = "/";
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("user", new Blob([JSON.stringify({
                userName: editUsername,
                about: editAbout,
            })], { type: "application/json" }));

            if (selectedFile) formData.append("file", selectedFile);

            const response = await axios.put(
                `${ENV.api_url}/api/users/me`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                setSelectedFile(null);
                setPreview(null);
                setIsEditingName(false);
                setIsEditingAbout(false);
                setShowSaveBtn(false);
                toast.success("Profile updated successfully");
                if (onUserUpdate) onUserUpdate(response.data);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="h-16 flex items-center gap-6 px-6 border-b border-gray-100 bg-white flex-shrink-0">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="font-bold text-xl text-gray-800">Profile</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Avatar Section */}
                <div className="flex justify-center py-10">
                    <div className="relative group w-48 h-48 rounded-full shadow-sm bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                        {preview || user?.profilePhotoUrl ? (
                            <img src={preview || user.profilePhotoUrl} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <span className="text-7xl font-bold text-gray-300">
                                {editUsername?.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <label className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">CHANGE PHOTO</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 space-y-6 pb-10 bg">

                    {/* Name Card */}
                    {/* Name Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-blue-600 mb-2 block">Your Name</label>

                        {/* This container ensures the icon stays inside the box */}
                        <div className="flex items-start justify-between  gap-2">
                            <div className="flex-1 min-w-0">
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="w-full border-b border-gray-300 outline-none text-gray-800 font-medium py-1"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-gray-800 break-words pr-2">{editUsername}</p>
                                )}
                            </div>

                            {/* The Icon Button */}
                            <button
                                onClick={() => isEditingName ? handleSaveProfile() : setIsEditingName(true)}
                                className="text-gray-400 hover:text-blue-600 flex-shrink-0 p-1 rounded-full hover:bg-gray-50 transition-all"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        </div>

                    
                    </div>

                    {/* About Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-blue-600 mb-2 block">About</label>

                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                {isEditingAbout ? (
                                    <textarea
                                        value={editAbout}
                                        onChange={(e) => setEditAbout(e.target.value)}
                                        className="w-full border-b border-gray-300 outline-none text-gray-800 resize-none py-1"
                                        rows="2"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm leading-relaxed break-words pr-2">{editAbout}</p>
                                )}
                            </div>

                            <button
                                onClick={() => isEditingAbout ? handleSaveProfile() : setIsEditingAbout(true)}
                                className="text-gray-400 hover:text-blue-600 flex-shrink-0 p-1 rounded-full hover:bg-gray-50 transition-all"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {showSaveBtn && (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                            <button onClick={handleSaveProfile} className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-sm font-bold shadow-md hover:bg-black transition-all">Save Changes</button>
                            <button onClick={handleCancelImage} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-2xl text-sm font-bold hover:bg-gray-200">Cancel</button>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 px-4 rounded-[2rem] border border-red-50 bg-[#fffafa] hover:bg-red-50 transition-colors shadow-sm"
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;