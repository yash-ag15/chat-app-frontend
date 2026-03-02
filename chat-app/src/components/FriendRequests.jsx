import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FriendRequests = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [sentRequests, setSentRequests] = useState(() => {
    const saved = localStorage.getItem("sentRequests");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sentRequests", JSON.stringify(sentRequests));
  }, [sentRequests]);

  useEffect(() => {
    const fetchAllRequest = async () => {
      try {
        const url = "http://localhost:8080/friends/requests";
        const token = localStorage.getItem("token");
        const response = await axios.get(url,

          {
            headers:
            {
              Authorization: `Bearer ${token}`
            }
          })
        setRequests(response.data)
      }
      catch (error) {
        if (error.response?.status === 401) {
          toast.error(error.response.data || "Session expired");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error("Error fetching friend requests:", error);
          toast.error("Failed to load friend requests");
        }
      }
    }
    fetchAllRequest();
  }, []);


  const handleAccept = async (requestId, senderName) => {
    try {
      const url = `http://localhost:8080/friends/request/accept/${requestId}`;
      const token = localStorage.getItem("token");

      const response = await axios.put(
        url,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setRequests(prev => prev.filter(r => r.requestId !== requestId));
        setSentRequests(prev => prev.filter(name => name !== senderName));
        toast.success(response.data);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data || "Session expired");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(error.response.data || "Failed to accept request");
      }
    }
  };

  const handleDecline = async (requestId, senderName) => {
    try {
      const url = `http://localhost:8080/friends/request/reject/${requestId}`;
      const token = localStorage.getItem("token");

      const response = await axios.put(
        url,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setRequests(prev => prev.filter(r => r.requestId !== requestId));
        setSentRequests(prev => prev.filter(name => name !== senderName));
        toast.success(response.data);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data || "Session expired");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(error.response.data || "Failed to decline request");
      }
    }
  };

  const handleSendRequest = async () => {
    try {
      const url = `http://localhost:8080/friends/requests/${searchUser}`;
      const token = localStorage.getItem("token");
      const response = await axios.post(url,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status == 200) {
        if (searchUser.trim() && !sentRequests.includes(searchUser.trim())) {
          setSentRequests((prev) => [...prev, searchUser.trim()]);
          setSearchUser("");
        }
        toast.success(response.data);
       
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data || "Session expired");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(error.response.data || "Failed to send request");
      }
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
              <div key={req.requestId} className="flex items-center gap-3 p-2 rounded-lg"
                style={{ backgroundColor: "hsl(0 0% 97%)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "hsl(0 0% 85%)" }}>
                  <span className="text-sm font-medium" style={{ color: "hsl(0 0% 30%)" }}>
                    {req.senderName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "hsl(0 0% 10%)" }}>{req.senderName}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => handleAccept(req.requestId, req.senderName)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                    style={{ backgroundColor: "hsl(0 0% 12%)", color: "white" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 25%)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 12%)"}>
                    Accept
                  </button>
                  <button onClick={() => handleDecline(req.requestId, req.senderName)}
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
