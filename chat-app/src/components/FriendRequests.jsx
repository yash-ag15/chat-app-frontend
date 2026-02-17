import { useState } from "react";

const incomingRequests = [
  { id: "r1", name: "Sarah", message: "Hey, let's connect!" },
  { id: "r2", name: "Mike", message: "We met at the conference" },
  { id: "r3", name: "Luna", message: "Friend of Alice" },
];

const FriendRequests = ({ onClose }) => {
  const [requests, setRequests] = useState(incomingRequests);
  const [searchUser, setSearchUser] = useState("");
  const [sentRequests, setSentRequests] = useState([]);

  const handleAccept = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSendRequest = () => {
    if (searchUser.trim() && !sentRequests.includes(searchUser.trim())) {
      setSentRequests((prev) => [...prev, searchUser.trim()]);
      setSearchUser("");
    }
  };

  return (
    <div
      className="absolute right-0 top-14 w-80 z-50 rounded-xl overflow-hidden"
      style={{
        backgroundColor: "hsl(0 0% 100%)",
        boxShadow: "0 8px 32px hsl(0 0% 0% / 0.12)",
        border: "1px solid hsl(0 0% 90%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "hsl(0 0% 92%)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "hsl(0 0% 10%)" }}>
          Friend Requests
        </h3>
        <button onClick={onClose} className="p-1 rounded-full transition-colors duration-200"
          style={{ color: "hsl(0 0% 50%)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 95%)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Send Request */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(0 0% 92%)" }}>
        <p className="text-xs font-medium mb-2" style={{ color: "hsl(0 0% 45%)" }}>
          Add a friend
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter username"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendRequest()}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none transition-shadow duration-200"
            style={{
              backgroundColor: "hsl(0 0% 96%)",
              color: "hsl(0 0% 10%)",
              border: "1px solid hsl(0 0% 90%)",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "hsl(0 0% 60%)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "hsl(0 0% 90%)"}
          />
          <button
            onClick={handleSendRequest}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
            style={{
              backgroundColor: "hsl(0 0% 12%)",
              color: "white",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 25%)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 12%)"}
          >
            Send
          </button>
        </div>
        {sentRequests.length > 0 && (
          <div className="mt-2 space-y-1">
            {sentRequests.map((name) => (
              <div key={name} className="flex items-center justify-between px-2 py-1 rounded-md text-xs"
                style={{ backgroundColor: "hsl(0 0% 96%)", color: "hsl(0 0% 45%)" }}>
                <span>Sent to <strong style={{ color: "hsl(0 0% 10%)" }}>{name}</strong></span>
                <span>Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming Requests */}
      <div className="px-4 py-3">
        <p className="text-xs font-medium mb-2" style={{ color: "hsl(0 0% 45%)" }}>
          Incoming requests ({requests.length})
        </p>
        {requests.length === 0 ? (
          <p className="text-xs py-4 text-center" style={{ color: "hsl(0 0% 60%)" }}>
            No pending requests
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-2 rounded-lg"
                style={{ backgroundColor: "hsl(0 0% 97%)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(0 0% 85%)" }}>
                  <span className="text-sm font-medium" style={{ color: "hsl(0 0% 30%)" }}>
                    {req.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "hsl(0 0% 10%)" }}>{req.name}</p>
                  <p className="text-xs truncate" style={{ color: "hsl(0 0% 55%)" }}>{req.message}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleAccept(req.id)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                    style={{ backgroundColor: "hsl(0 0% 12%)", color: "white" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 25%)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 12%)"}>
                    Accept
                  </button>
                  <button onClick={() => handleDecline(req.id)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: "hsl(0 0% 94%)",
                      color: "hsl(0 0% 40%)",
                      border: "1px solid hsl(0 0% 88%)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 90%)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 94%)"}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
