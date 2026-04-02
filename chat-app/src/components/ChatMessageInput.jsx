// import { useState } from "react";
// import { sendMessageWS } from "../services/webscoket";

// const ChatMessageInput = ({ selectedChat }) => {
//   const [text, setText] = useState("");

//   const sendMessage = () => {
//     const trimmedText = text.trim();

//     if (!trimmedText || !selectedChat?.chatId) return;

//     const payload = {
//       chatId: selectedChat.chatId,
//       content: trimmedText,
//     };

//     const sent = sendMessageWS(payload);

//     if (sent) {
//       setText("");
//     }
//   };

//   return (
//     <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-200">
//       <input
//         type="text"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Type a message"
//         className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none bg-gray-100"
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             sendMessage();
//           }
//         }}
//       />

//       <button
//         onClick={sendMessage}
//         className="p-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800"
//       >
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//           <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default ChatMessageInput;
import { useState } from "react";
import { sendMessageWS, sendTypingWS } from "../services/webscoket";
import { useRef } from "react";
import axios from "axios";
import { ENV } from "../../../config.js";
import EmojiPicker from "emoji-picker-react";
const ChatMessageInput = ({ selectedChat, currUser }) => {

  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const typingTimeoutRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };
  const sendMessage = async () => {

    if ((!text.trim() && !selectedFile) || isUploading) return;
    if (!selectedChat?.chatId) return;

    const token = localStorage.getItem("token");

    try {
      setIsUploading(true); //setting upload statte true

      let imageUrl = null;

      if (selectedFile) {
        const formdata = new FormData();
        formdata.append("file", selectedFile);

        const response = await axios.post(
          `${ENV.api_url}/upload/message-image`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        imageUrl = response.data;
      }

      const payload = {
        chatId: selectedChat.chatId,
        content: text.trim(),
        imageUrl: imageUrl
      };

      sendMessageWS(payload);

      // reset
      setText("");
      setSelectedFile(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  const handleTyping = () => {
    if (!selectedChat?.chatId) return;
    const paylaod = {
      chatId: selectedChat.chatId,
      senderName: currUser,
      isTyping: true

    }
    sendTypingWS(paylaod);

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingWS({ ...paylaod, isTyping: false });
    }, 1000);
  }

  return (

    <div className="relative ">

      {showEmoji && (
      <div
        className="absolute bottom-16 left-3 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            setText(prev => prev + emojiData.emoji);
          }}
        />
      </div>
    )}

      {/*  IMAGE PREVIEW */}
      {preview && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100">
          <img
            src={preview}
            className="w-16 h-16 object-cover rounded"
          />

          <button
            onClick={removeImage}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {isUploading && (
        <div className="px-3 py-1 text-xs text-gray-500">
          Uploading image...
        </div>
      )}

      {/* INPUT BAR */}
      <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-200">

        {/* ➕ FILE BUTTON */}
        <label className="cursor-pointer text-xl font-bold px-2">
          +
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>

        <button
          onClick={() => setShowEmoji(prev => !prev)}
          className="text-xl px-2"
        >
          😊
        </button>

        {/* INPUT */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none bg-gray-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />


        {/* SEND */}
        <button
          onClick={sendMessage}
          disabled={isUploading}
          className={`p-2.5 rounded-full text-white ${isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-800"
            }`}
        >
          {isUploading ? (
            <span className="text-xs">...</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>

      </div>

    </div>
  );
};

export default ChatMessageInput;