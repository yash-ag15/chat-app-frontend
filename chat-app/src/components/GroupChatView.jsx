import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ChatMessageInput from "./ChatMessageInput";
import GroupMembersManager from "./GroupMembersManager";
import { connectWebSocket, subscribeToChat } from "../services/webscoket";

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

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldScrollOnLoadRef = useRef(false);

 const scrollToBottom = () => {
  const container = containerRef.current;

  if (container) {
    container.scrollTop = container.scrollHeight;
    return;
  }

  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
};

  const fetchMessages = async (pageNumber) => {

    if (!selectedChat?.chatId) return;

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/messages/${selectedChat.chatId}?page=${pageNumber}&size=20`,
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

      // older messages added at top
      setMessages(prev => [...orderedMessages, ...prev]);

    } catch (error) {

      console.error("Error fetching messages", error);

    }

  };

  // load first messages
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

  };

  // websocket messages
  useEffect(() => {

    if (!selectedChat) return;

    connectWebSocket(() => {

      subscribeToChat(selectedChat.chatId, (message) => {

        setMessages(prev => [...prev, message]);
         setTimeout(() => {
    scrollToBottom();
  }, 0);

      });

    });

  }, [selectedChat]);

  return (

  <div className="flex-1 flex flex-col min-h-0">

    <GroupMembersManager selectedChat={selectedChat} />

    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-1.5 bg-gray-50 min-h-0"
    >

      {messages.map((msg) => {

        const isMe = msg.senderName === currUser;

        return (

          <div
            key={msg.messageId}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >

            <div
              className={`max-w-[65%] px-3.5 py-2 rounded-2xl ${
                isMe
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
             
              <p className="text-sm">
                {msg.content}
              </p>

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

    <ChatMessageInput selectedChat={selectedChat} />

  </div>

);

};

export default ChatView;
