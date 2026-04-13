import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ChatMessageInput from "./ChatMessageInput";
import GroupMembersManager from "./GroupMembersManager";
import { getStompClient, subscribeToChat } from "../services/webscoket";
import { ENV } from "../../../config.js";


const formatTime = (time) => {
  if (!time) return "";

  const date = new Date(time);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const ChatView = ({ currUser, selectedChat }) => {

  const isGroup = selectedChat?.isGroup;
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldScrollOnLoadRef = useRef(false);


  const typingTimeoutRef = useRef(null);



  const scrollToBottom = () => {
    const container = containerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
      return;
    }

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [showNewMessage, setShowNewMessage] = useState(false);

  const isBottomVisible = () => {
    const container = containerRef.current;

    if (!container) return true;

    return (container.scrollTop + container.clientHeight >=
      container.scrollHeight - 100);
  }

  const fetchMessages = async (pageNumber) => {

    if (!selectedChat?.chatId) return;

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${ENV.api_url}/messages/${selectedChat.chatId}?page=${pageNumber}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newMessages = response.data.content || [];

      if (newMessages.length === 0) {
        setHasMore(false);
      }

      const orderedMessages = [...newMessages].reverse();

      if (pageNumber === 0) {
        shouldScrollOnLoadRef.current = true;
        setMessages(orderedMessages);
        return;
      }


      setMessages(prev => [...orderedMessages, ...prev]);

    } catch (error) {

      console.error("Error fetching messages", error);

    }

  };

  useEffect(() => {

    if (!selectedChat) return;

    setMessages([]);
    setPage(0);
    setHasMore(true);

    fetchMessages(0);


  }, [selectedChat]);

  useEffect(() => {
    if (!messages.length || !shouldScrollOnLoadRef.current) return;

    shouldScrollOnLoadRef.current = false;
    scrollToBottom();
  }, [messages]);


  // simple scroll detection
  const handleScroll = () => {

    const container = containerRef.current;

    if (!container) return;

    if (container.scrollTop === 0 && hasMore) {

      const nextPage = page + 1;

      setPage(nextPage);

      fetchMessages(nextPage);

    }

    if (isBottomVisible()) {
      setShowNewMessage(false);
    }

  };

  // websocket messages
  useEffect(() => {
    if (!selectedChat) return;

    let subscription;

    const waitForConnection = () => {
      const client = getStompClient();

      if (client && client.connected) {
        subscription = client.subscribe(
          `/topic/chat/${selectedChat.chatId}`,
          (msg) => {
            const message = JSON.parse(msg.body);

            setMessages(prev => {
              const exists = prev.some(m => m.messageId === message.messageId);
              if (exists) return prev;
              return [...prev, message];
            });

            const isMe = message.senderName === currUser;

            if (isMe) {
              setTimeout(scrollToBottom, 20);
              return;
            }

            if (isBottomVisible()) {
              setTimeout(scrollToBottom, 20);
            } else {
              setShowNewMessage(true);
            }
          }
        );
      } else {
        setTimeout(waitForConnection, 100);
      }
    };

    waitForConnection();

    return () => subscription?.unsubscribe();
  }, [selectedChat]);
  useEffect(() => {
    if (!selectedChat) return;

    let subscription;

    const waitForConnection = () => {
      const client = getStompClient();

      if (client && client.connected) {
        subscription = client.subscribe(
          `/topic/typing/${selectedChat.chatId}`,
          (message) => {
            const data = JSON.parse(message.body);
            if (data.senderName === currUser) return;

            setTypingUser(data.isTyping ? data.senderName : null);
          }
        );
      } else {
        setTimeout(waitForConnection, 100);
      }
    };

    waitForConnection();

    return () => subscription?.unsubscribe();
  }, [selectedChat]);

 return (
  <div className="relative flex flex-col h-full min-h-0 overflow-hidden">

    <GroupMembersManager selectedChat={selectedChat} />

    {/* SCROLL AREA */}
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0 h-0 px-4 md:px-16 py-4 pb-18 space-y-1.5 bg-gray-50"
    >
      {messages.map((msg) => {
        const isMe = msg.senderName === currUser;
        const isGroup = selectedChat?.isGroup;
        const showSender = isGroup && !isMe;

        return (
          <div
            key={msg.messageId}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[65%] px-3 py-1.5 rounded-2xl ${
                isMe ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              }`}
            >
              {showSender && (
                <p className="text-xs opacity-70">{msg.senderName}</p>
              )}

              {msg.imageUrl ? (
                <div className="flex flex-col gap-1">
                  <img
                    src={msg.imageUrl}
                    onClick={() => setImagePreview(msg.imageUrl)}
                    className="rounded-lg max-h-60 object-cover"
                  />
                  {msg.content && (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm break-words">{msg.content}</p>
              )}

              <div className="flex justify-end mt-1">
                <span className="text-[10px] opacity-70">
                  {formatTime(msg.sentAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef}></div>
    </div>

    {/* NEW MESSAGE BUTTON */}
    {showNewMessage && (
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => {
            scrollToBottom();
            setShowNewMessage(false);
          }}
          className="bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow"
        >
          New Messages ↓
        </button>
      </div>
    )}

    {/* TYPING */}
    {typingUser && (
      <div className="absolute bottom-20 left-4 z-10 text-sm bg-gray-200 px-3 py-1 rounded-full">
        {typingUser} is typing...
      </div>
    )}

    {/* INPUT (FIXED) */}
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-white border-t">
      <ChatMessageInput selectedChat={selectedChat} currUser={currUser} />
    </div>

    {/* IMAGE PREVIEW */}
    {imagePreview && (
      <div
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        onClick={() => setImagePreview(null)}
      >
        <button
          className="absolute top-4 right-4 text-black text-2xl"
          onClick={() => setImagePreview(null)}
        >
          ✕
        </button>

        <img
          src={imagePreview}
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
  </div>
);

};

export default ChatView;
