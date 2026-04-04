import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
    }

    const handleCancelImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setShowSaveBtn(false);
};

    const navigate = useNavigate()
    const handleSaveProfile = async () => {


        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("user", new Blob([JSON.stringify({
                userName: editUsername,
                about: editAbout,
            })],
                { type: "application/json" }));

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            const response = await axios.put(
                `${ENV.api_url}/api/users/me`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state with response
            if (response.data) {
                setSelectedFile(null);
                setPreview(null);
                setIsEditingName(false);
                setIsEditingAbout(false);
                setShowSaveBtn(false);
                toast.success("Profile updated successfully");
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
        <div className="w-full md:w-80 h-full flex flex-col bg-white">
            {/* Header */}
            <div className="h-14 flex items-center gap-4 px-4 border-b border-gray-200">
                <button onClick={onClose} className="p-1.5 rounded-full transition-colors duration-200 text-gray-700 hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="font-semibold text-lg text-gray-900">Profile</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Avatar */}
                <div className="flex justify-center py-8">
                    <div className="w-36 h-36 rounded-full flex items-center justify-center bg-gray-200">

                        {preview || user?.profilePhotoUrl ? (
                            <img
                                src={preview || user.profilePhotoUrl}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-5xl font-light text-gray-600">
                                {editUsername?.charAt(0) || user?.userName?.charAt(0)}
                            </span>
                        )}


                    </div>



                </div>

                <div className="flex justify-center mb-2">
                    <label className=" hover:underline cursor-pointer text-sm text-black font-medium">
                        Edit Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>



                {/* Name */}
                <div className="mx-4 rounded-xl p-4 mb-2 bg-gray-50">
                    <p className="text-xs mb-1 text-gray-600">Your Name</p>
                    <div className="flex justify-between items-center">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="flex-1 px-2 py-1 rounded border border-gray-300 text-sm outline-none focus:border-gray-500"
                                autoFocus
                            />
                        ) : (
                            <p className="text-base font-medium text-gray-900">{editUsername}</p>
                        )}
                        <button onClick={() => {
                            if (isEditingName) {
                                handleSaveProfile();
                            } else {
                                setIsEditingName(true);
                            }
                        }} className="text-gray-600 hover:text-gray-800 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="px-6 py-2 text-xs text-gray-500">
                    This is not your username. This name will be visible to your contacts.
                </p>

                {/* About */}
                <div className="mx-4 rounded-xl p-4 bg-gray-50">
                    <p className="text-xs mb-1 text-gray-600">About</p>
                    <div className="flex justify-between items-center gap-2">
                        {isEditingAbout ? (
                            <textarea
                                value={editAbout}
                                onChange={(e) => setEditAbout(e.target.value)}
                                className="flex-1 px-2 py-1 rounded border border-gray-300 text-sm outline-none resize-none focus:border-gray-500"
                                rows="2"
                                autoFocus
                            />
                        ) : (
                            <p className="text-base text-gray-900">{editAbout}</p>
                        )}
                        <button onClick={() => {
                            if (isEditingAbout) {
                                handleSaveProfile();
                            } else {
                                setIsEditingAbout(true);
                            }
                        }} className="text-gray-600 hover:text-gray-800 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {showSaveBtn && (
                    <div className="mt-6 mx-4 flex gap-2">

                        <button
                            onClick={handleSaveProfile}
                            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-900 text-white hover:bg-gray-800"
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={handleCancelImage}
                            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSidebar;
