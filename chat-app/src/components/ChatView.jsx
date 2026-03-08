import axios from "axios";
import { useEffect, useState, useRef } from "react";

const formatTime = (time) => {
  if (!time) return "";

  const date = new Date(time);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const ChatView = ({ currUser, selectedChat }) => {

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const fetchMessages = async (pageNumber) => {

    if (loading) return;

    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:8080/messages/${selectedChat.chatId}?page=${pageNumber}&size=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const newMessages = response.data.content;

    if (newMessages.length === 0) {
      setHasMore(false);
    }

    setMessages(prev => [...newMessages.reverse(), ...prev]);

    setLoading(false);
  };

  useEffect(() => {

    if (!selectedChat) return;

    setMessages([]);
    setPage(0);
    setHasMore(true);

    fetchMessages(0);

  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const handleScroll = () => {

    const container = containerRef.current;

    if (!container) return;

    if (container.scrollTop < 50 && hasMore && !loading) {

      const nextPage = page + 1;

      setPage(nextPage);

      fetchMessages(nextPage);
    }
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-1.5 bg-gray-50"
      >

        <div className="flex justify-center mb-3">
          <span className="px-4 py-1 rounded-full text-xs font-medium bg-white text-gray-500 shadow-sm">
            Today
          </span>
        </div>

        {messages.map((msg) => {

          const isMe = msg.senderName === currUser;

          return (
            <div
              key={msg.messageId}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[65%] px-3.5 py-2 rounded-2xl ${isMe
                    ? "bg-gray-700 text-white rounded-br-sm shadow-md"
                    : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                  }`}
              >
                <p className="text-sm leading-relaxed">
                  {msg.content}
                </p>

                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] ${isMe ? "text-white opacity-70" : "text-gray-500"
                    }`}>
                    {formatTime(msg.sentAt)}
                  </span>
                </div>
              </div>
            </div>
          );

        })}

        <div ref={bottomRef}></div>

      </div>

      {/* Message Input */}
      <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-200">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none bg-gray-100"
        />

        <button className="p-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default ChatView;