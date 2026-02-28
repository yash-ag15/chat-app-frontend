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
      <div
        className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-1.5"
        style={{ backgroundColor: "hsl(0 0% 97%)" }}
      >
        {/* Date divider */}
        <div className="flex justify-center mb-3">
          <span className="px-4 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "hsl(0 0% 100%)",
              color: "hsl(0 0% 50%)",
              boxShadow: "0 1px 4px hsl(0 0% 0% / 0.06)",
            }}>
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[65%] px-3.5 py-2 rounded-2xl relative transition-shadow duration-200"
              style={{
                ...(msg.sender === "me"
                  ? {
                    backgroundColor: "hsl(0 0% 12%)",
                    color: "white",
                    borderBottomRightRadius: "6px",
                    boxShadow: "0 1px 4px hsl(0 0% 0% / 0.1)",
                  }
                  : {
                    backgroundColor: "hsl(0 0% 100%)",
                    borderBottomLeftRadius: "6px",
                    boxShadow: "0 1px 4px hsl(0 0% 0% / 0.06)",
                  }),
              }}
            >
              <p className="text-sm leading-relaxed"
                style={{ color: msg.sender === "me" ? "white" : "hsl(0 0% 10%)" }}>
                {msg.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px]"
                  style={{ color: msg.sender === "me" ? "hsl(0 0% 100% / 0.6)" : "hsl(0 0% 55%)" }}>
                  {msg.time}
                </span>
                {msg.sender === "me" && (
                  <span className="text-[10px]" style={{ color: "hsl(0 0% 100% / 0.7)" }}>✓✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-3 py-2.5 flex items-center gap-2"
        style={{
          backgroundColor: "hsl(0 0% 100%)",
          borderTop: "1px solid hsl(0 0% 94%)",
        }}>
        <button className="p-2 rounded-full transition-colors duration-200"
          style={{ color: "hsl(0 0% 50%)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "hsl(0 0% 20%)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "hsl(0 0% 50%)"}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
        </button>
        <button className="p-2 rounded-full transition-colors duration-200"
          style={{ color: "hsl(0 0% 50%)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "hsl(0 0% 20%)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "hsl(0 0% 50%)"}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-shadow duration-200"
          style={{
            backgroundColor: "hsl(0 0% 96%)",
            color: "hsl(0 0% 10%)",
          }}
          onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px hsl(0 0% 0% / 0.08)"}
          onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
        />
        <button className="p-2.5 rounded-full transition-all duration-200"
          style={{
            backgroundColor: "hsl(0 0% 12%)",
            color: "white",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 25%)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 0% 12%)"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
