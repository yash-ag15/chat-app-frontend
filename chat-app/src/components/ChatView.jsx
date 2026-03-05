const messages = [
  { id: "1", text: "Hey! How are you?", sender: "them", time: "10:00" },
  { id: "2", text: "I'm good! Just working on the project.", sender: "me", time: "10:02" },
  { id: "3", text: "That's great. Need any help?", sender: "them", time: "10:03" },
  { id: "4", text: "Actually yes! Can you review my code?", sender: "me", time: "10:05" },
  { id: "5", text: "Sure, send it over 👍", sender: "them", time: "10:06" },
  { id: "6", text: "Thanks! Sending now...", sender: "me", time: "10:07" },
  { id: "7", text: "Got it. I'll look at it tonight and get back to you", sender: "them", time: "10:08" },
  { id: "8", text: "No rush, take your time!", sender: "me", time: "10:10" },
];

const ChatView = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-1.5 bg-gray-50">
        {/* Date divider */}
        <div className="flex justify-center mb-3">
          <span className="px-4 py-1 rounded-full text-xs font-medium bg-white text-gray-500 shadow-sm">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[65%] px-3.5 py-2 rounded-2xl relative transition-shadow duration-200 ${
                msg.sender === "me"
                  ? "bg-gray-900 text-white rounded-br-sm shadow-md"
                  : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">
                {msg.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className={`text-[10px] ${msg.sender === "me" ? "text-white text-opacity-60" : "text-gray-600"}`}>
                  {msg.time}
                </span>
                {msg.sender === "me" && (
                  <span className="text-[10px] text-white text-opacity-70">✓✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-200">
        <button className="p-2 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
        </button>
        <button className="p-2 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-shadow duration-200 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-gray-300"
        />
        <button className="p-2.5 rounded-full transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
