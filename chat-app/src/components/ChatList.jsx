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

const ChatList = ({ onSelectChat, selectedChatId }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-0.5">
                {chats.map((chat, index) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat?.(chat)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                            selectedChatId === chat.id ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300">
                                <span className="text-lg font-medium text-gray-700">
                                    {chat.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {chat.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left py-1">
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-sm font-semibold truncate text-gray-900">
                                    {chat.name}
                                </h4>
                                <span className="text-xs shrink-0 ml-2 text-gray-600">
                                    {chat.time}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-0.5">
                                <p className="text-sm truncate text-gray-600">
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
