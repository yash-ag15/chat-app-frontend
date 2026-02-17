const chats = [
    { id: "1", name: "Alice", lastMessage: "Hey! How are you doing?", time: "10:30", online: true },
    { id: "2", name: "Bob", lastMessage: "See you tomorrow 👋", time: "09:15", online: false },
    { id: "3", name: "Charlie", lastMessage: "That sounds great!", time: "Yesterday", online: true },
    { id: "4", name: "Diana", lastMessage: "📷 Photo", time: "Yesterday", online: false },
    { id: "5", name: "Team Project", lastMessage: "Emma: Let's meet at 5pm", time: "Yesterday", online: false },
    { id: "6", name: "Frank", lastMessage: "Thanks for the help!", time: "Monday", online: true },
    { id: "7", name: "Grace", lastMessage: "✓✓ Ok, done", time: "Monday", online: false },
    { id: "8", name: "Study Group", lastMessage: "You: Notes uploaded", time: "Sunday", online: false },
];

const avatarShades = [
    "hsl(0 0% 82%)", "hsl(0 0% 78%)", "hsl(0 0% 84%)", "hsl(0 0% 76%)",
    "hsl(0 0% 80%)", "hsl(0 0% 86%)", "hsl(0 0% 74%)", "hsl(0 0% 88%)",
];

const ChatList = ({ onSelectChat, selectedChatId }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-0.5">
                {chats.map((chat, index) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat?.(chat)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
                        style={{
                            background: selectedChatId === chat.id ? "hsl(0 0% 94%)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (selectedChatId !== chat.id) e.currentTarget.style.background = "hsl(0 0% 96%)";
                        }}
                        onMouseLeave={(e) => {
                            if (selectedChatId !== chat.id) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: avatarShades[index % avatarShades.length] }}>
                                <span className="text-lg font-medium" style={{ color: "hsl(0 0% 30%)" }}>
                                    {chat.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {chat.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                                    style={{ backgroundColor: "hsl(142 70% 49%)" }} />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left py-1">
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-sm font-semibold truncate" style={{ color: "hsl(0 0% 10%)" }}>
                                    {chat.name}
                                </h4>
                                <span className="text-xs flex-shrink-0 ml-2" style={{ color: "hsl(0 0% 55%)" }}>
                                    {chat.time}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-0.5">
                                <p className="text-sm truncate" style={{ color: "hsl(0 0% 55%)" }}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
