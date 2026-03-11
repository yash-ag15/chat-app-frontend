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
import { sendMessageWS } from "../services/webscoket";

const ChatMessageInput = ({ selectedChat }) => {

  const [text, setText] = useState("");

  const sendMessage = () => {

    // prevent empty message
    if (!text.trim()) return;

    // make sure chat is selected
    if (!selectedChat?.chatId) return;

    const payload = {
      chatId: selectedChat.chatId,
      content: text.trim()
    };

    sendMessageWS(payload);

    setText("");
  };

  return (

    <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-200">

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none bg-gray-100"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        className="p-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800"
      >

        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>

      </button>

    </div>
  );
};

export default ChatMessageInput;