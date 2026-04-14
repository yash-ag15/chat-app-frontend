/* ChatView.jsx */
import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessageInput from "./ChatMessageInput";
import GroupMembersManager from "./GroupMembersManager";
import { getStompClient } from "../services/webscoket";
import { ENV } from "../../../config.js";

const formatTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatView = ({ currUser, selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldScrollOnLoadRef = useRef(false);

  const scrollToBottom = useCallback((behavior = "auto") => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior });
    }
  }, []);

  const isBottomVisible = () => {
    const container = containerRef.current;
    if (!container) return true;
    return container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
  };

 




const lastHeightRef = useRef(window.visualViewport?.height || window.innerHeight);

const isFirstKeyboardOpen = useRef(true);

useEffect(() => {
  const handleResize = () => {
    const currentHeight = window.visualViewport?.height || window.innerHeight;
    const container = containerRef.current;
    
    if (!container || !currentHeight) return;

    const isOpening = currentHeight < lastHeightRef.current;
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 150;

   
    if (isOpening) {
      if (isFirstKeyboardOpen.current || isAtBottom) {
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 100);
        isFirstKeyboardOpen.current = false; // It's no longer the first time
      }
    } else {
     
      if (isAtBottom) {
        setTimeout(() => scrollToBottom("smooth"), 100);
      }
    }

    lastHeightRef.current = currentHeight;
  };

  window.visualViewport?.addEventListener("resize", handleResize);
  return () => window.visualViewport?.removeEventListener("resize", handleResize);
}, [scrollToBottom]);

// Reset the "First Open" tracker whenever the selectedChat changes
useEffect(() => {
  isFirstKeyboardOpen.current = true;
}, [selectedChat]);

  const fetchMessages = async (pageNumber) => {
    if (!selectedChat?.chatId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${ENV.api_url}/messages/${selectedChat.chatId}?page=${pageNumber}&size=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessages = response.data.content || [];
      if (newMessages.length === 0) setHasMore(false);
      const orderedMessages = [...newMessages].reverse();

      if (pageNumber === 0) {
        shouldScrollOnLoadRef.current = true;
        setMessages(orderedMessages);
      } else {
        // Maintain scroll position when loading older messages
        const container = containerRef.current;
        const oldScrollHeight = container.scrollHeight;
        setMessages(prev => [...orderedMessages, ...prev]);
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - oldScrollHeight;
        }, 0);
      }
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
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollTop === 0 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
    if (isBottomVisible()) setShowNewMessage(false);
  };

  useEffect(() => {
    if (!selectedChat) return;
    let subscription;
    const waitForConnection = () => {
      const client = getStompClient();
      if (client?.connected) {
        subscription = client.subscribe(`/topic/chat/${selectedChat.chatId}`, (msg) => {
          const message = JSON.parse(msg.body);
          setMessages(prev => {
            if (prev.some(m => m.messageId === message.messageId)) return prev;
            return [...prev, message];
          });
          const isMe = message.senderName === currUser;
          if (isMe || isBottomVisible()) {
            setTimeout(() => scrollToBottom("smooth"), 50);
          } else {
            setShowNewMessage(true);
          }
        });
      } else {
        setTimeout(waitForConnection, 100);
      }
    };
    waitForConnection();
    return () => subscription?.unsubscribe();
  }, [selectedChat, currUser, scrollToBottom]);

  useEffect(() => {
    if (!selectedChat) return;
    let subscription;
    const waitForConnection = () => {
      const client = getStompClient();
      if (client?.connected) {
        subscription = client.subscribe(`/topic/typing/${selectedChat.chatId}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.senderName !== currUser) setTypingUser(data.isTyping ? data.senderName : null);
        });
      } else {
        setTimeout(waitForConnection, 100);
      }
    };
    waitForConnection();
    return () => subscription?.unsubscribe();
  }, [selectedChat, currUser]);

  return (
    
    <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50">
      <GroupMembersManager selectedChat={selectedChat} />

      {/* SCROLL AREA */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 px-4 md:px-16 py-4 pb-2 space-y-1.5"
      >
        {messages.map((msg) => {
          const isMe = msg.senderName === currUser;
          const showSender = selectedChat?.isGroup && !isMe;
          return (
            <div key={msg.messageId} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-1.5 rounded-2xl shadow-sm ${isMe ? "bg-gray-700 text-white" : "bg-white text-gray-900 border"}`}>
                {showSender && <p className="text-[10px] font-bold mb-1 opacity-70 uppercase">{msg.senderName.split('@')[0]}</p>}
                {msg.imageUrl ? (
                  <div className="flex flex-col gap-1">
                    <img src={msg.imageUrl} alt="sent" onClick={() => setImagePreview(msg.imageUrl)} className="rounded-lg max-h-60 object-cover cursor-pointer" />
                    {msg.content && <p className="text-sm">{msg.content}</p>}
                  </div>
                ) : (
                  <p className="text-sm break-words">{msg.content}</p>
                )}
                <div className="flex justify-end mt-1">
                  <span className="text-[9px] opacity-60">{formatTime(msg.sentAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-2"></div>
      </div>

      {/* FLOATING UI ELEMENTS */}
      {showNewMessage && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <button onClick={() => { scrollToBottom("smooth"); setShowNewMessage(false); }} className="bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-gray-700">
            New Messages ↓
          </button>
        </div>
      )}

      {typingUser && (
        <div className="absolute bottom-24 left-4 z-10 text-[11px] bg-white/80 backdrop-blur-sm border px-3 py-1 rounded-full italic text-gray-600 shadow-sm animate-pulse">
          {typingUser.split('@')[0]} is typing...
        </div>
      )}

      {/* INPUT BAR: Positioned at bottom of the flex container */}
      <div className="bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        <ChatMessageInput selectedChat={selectedChat} currUser={currUser} />
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setImagePreview(null)}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:scale-110 transition-transform">&times;</button>
          <img src={imagePreview} alt="full-size" className="max-h-full max-w-full object-contain rounded-sm" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ChatView;