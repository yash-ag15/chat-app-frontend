import { useState } from "react";
import axios from "axios";
import { ENV } from "../../../config.js";

const ProfileModal = ({
  showProfile,
  setShowProfile,
  loadingState,
  profileData,
  profileType,
  setProfileData
}) => {

  const [uploading, setUploading] = useState(false);

   
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSave, setShowSave] = useState(false);

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowSave(true);
  };


  const handleSave = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);

      const res = await axios.put(
        `${ENV.api_url}/api/users/chat/${profileData.chatId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      setProfileData(res.data);

      // reset
      setSelectedFile(null);
      setPreview(null);
      setShowSave(false);

    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setShowSave(false);
  };

  if (!showProfile) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={() => setShowProfile(false)}
    >

      <div
        className="bg-white rounded-xl p-6 w-[320px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {loadingState ? (
          <p className="text-center text-sm">Loading...</p>
        ) : (

          <>
            {/* USER PROFILE */}
            {profileType === "USER" && profileData && (
              <div className="text-center">

                {profileData.profilePhotoUrl ? (
                  <img
                    src={profileData.profilePhotoUrl}
                    className="w-20 h-20 mx-auto mb-3 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-700">
                      {profileData.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <h2 className="font-semibold text-lg">
                  {profileData.userName}
                </h2>

                <p className="text-sm text-gray-500">
                  {profileData.about || "No status"}
                </p>

              </div>
            )}

            {/*GROUP PROFILE  */}
            {profileType === "GROUP" && profileData && (
              <div>

                {/*  IMAGE / PREVIEW */}
                <div className="text-center text-3xl mb-2 relative">

                  {preview ? (
                    <img
                      src={preview}
                      className="w-20 h-20 mx-auto rounded-full object-cover"
                    />
                  ) : profileData.groupPhotoUrl ? (
                    <img
                      src={profileData.groupPhotoUrl}
                      className="w-20 h-20 mx-auto rounded-full object-cover"
                    />
                  ) : (
                    "👥"
                  )}

                  {/* FILE INPUT */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                </div>

                {/*Uploading */}
                {uploading && (
                  <p className="text-center text-xs text-gray-500">
                    Uploading...
                  </p>
                )}

                {/*  SAVE BUTTON */}
                {showSave && (
                  <div className="text-center mt-2 space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-black text-white rounded text-sm"
                    >
                      Save
                    </button>

                    <button
                      onClick={handleCancel}
                      className="text-xs text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <h2 className="text-center font-semibold text-lg">
                  {profileData.chatName}
                </h2>

                <p className="text-center text-sm text-gray-500">
                  {profileData.memberCount} members
                </p>

                {/* MEMBERS */}
                <div className="mt-3 space-y-2">
                  {profileData.members?.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">

                      {m.profilePhotoUrl ? (
                        <img
                          src={m.profilePhotoUrl}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-700">
                            {m.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="text-sm">{m.username}</p>
                        <p className="text-xs text-gray-500">
                          {m.about}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default ProfileModal;