import { useState } from "react";
import FriendRequests from "./FriendRequests.jsx";

const Navbar = ({ title, subtitle, showBackButton, onBackClick, isChat }) => {
  const [showRequests, setShowRequests] = useState(false);

  return (
    <header
      className="h-14 flex items-center  justify-between px-4 relative"
      style={{
        backgroundColor: "hsl(0 0% 100%)",
        borderBottom: "1px solid hsl(0 0% 92%)",
      }}
    >
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="md:hidden p-1  rounded-full transition-colors duration-200"
            style={{ color: "hsl(0 0% 30%)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 95%)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {isChat ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center  justify-center"
              style={{ backgroundColor: "hsl(0 0% 88%)" }}>
              <span className="font-semibold text-sm" style={{ color: "hsl(0 0% 30%)" }}>
                {title?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <h2 className="font-medium text-sm leading-tight" style={{ color: "hsl(0 0% 10%)" }}>{title}</h2>
              {subtitle && (
                <p className="text-xs" style={{ color: "hsl(0 0% 55%)" }}>{subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-bold tracking-tight" style={{ color: "hsl(0 0% 10%)" }}>ChatHub</h1>
        )}
      </div>

      <div className="flex items-center  gap-1">
        {/* Friend Requests icon - shown on non-chat navbar */}
        {!isChat && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="p-2 rounded-full transition-colors  duration-200"
            style={{ color: "hsl(0 0% 45%)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "hsl(0 0% 95%)"; e.currentTarget.style.color = "hsl(0 0% 20%)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "hsl(0 0% 45%)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
        )}

        {!isChat && (
          <button className="p-2 rounded-full transition-colors  duration-200"
            style={{ color: "hsl(0 0% 45%)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "hsl(0 0% 95%)"; e.currentTarget.style.color = "hsl(0 0% 20%)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "hsl(0 0% 45%)"; }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        )}
      </div>

      {/* Friend Requests Dropdown */}
      {showRequests && <FriendRequests onClose={() => setShowRequests(false)} />}
    </header>
  );
};

export default Navbar;
