import { useState } from "react";
import FriendRequests from "./FriendRequests.jsx";
import axios from "axios";
import { ENV } from "../../../config.js";


const Navbar = ({ title, profilePhotoUrl, subtitle, showBackButton, onBackClick, isChat, selectedChat }) => {

  const [showRequests, setShowRequests] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileType, setProfileType] = useState(null);

  const handleProfileClick = async () => {
    if (!isChat) return;

    const token = localStorage.getItem("token");

    try {
      setShowProfile(true);
      setLoadingState(true);

      let res;

      if (selectedChat?.isGroup) {
        //  GROUP
        res = await axios.get(
          `${ENV.api_url}/api/users/chat/${selectedChat.chatId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfileType("GROUP");

      } else {
        //  USER
        res = await axios.get(
          `${ENV.api_url}/api/users/profile/${selectedChat.otherUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfileType("USER");
      }

      setProfileData(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 relative bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="md:hidden p-1 rounded-full  transition-colors duration-200 text-gray-700 hover:bg-gray-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {isChat ? (
          <div className="flex items-center gap-3 ">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-300"
              onClick={handleProfileClick}>
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-gray-700">
                  {title.charAt(0).toUpperCase()}
                </span>
              )}

            </div>
            <div>
              <h2 className="font-medium text-sm leading-tight text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-xs text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-bold tracking-tight text-gray-900">ChatHub</h1>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Friend Requests icon - shown on non-chat navbar */}
        {!isChat && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="p-2 rounded-full transition-colors duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
        )}

        {/* {!isChat && (
          <button className="p-2 rounded-full transition-colors duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        )} */}
      </div>

      {/* Friend Requests Dropdown */}
      {showRequests && <FriendRequests onClose={() => setShowRequests(false)} />}

      {showProfile && (
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
                {/*  USER PROFILE */}
                {profileType === "USER" && profileData && (
                  <div className="text-center">
                    {/* <img
                      src={profileData.profilePhotoUrl}
                      className="w-20 h-20 rounded-full mx-auto mb-3"
                    /> */}

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

                {/*  GROUP PROFILE */}
                {profileType === "GROUP" && profileData && (
                  <div>
                    <div className="text-center text-3xl mb-2">👥</div>

                    <h2 className="text-center font-semibold text-lg">
                      {profileData.chatName}
                    </h2>

                    <p className="text-center text-sm text-gray-500">
                      {profileData.memberCount} members
                    </p>

                    <div className="mt-3 space-y-2">
                      {profileData.members.map((m) => (
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
      )}
    </header>
  );
};

export default Navbar;
