
const formatTime = (time) => {
    if (!time) return "";

    const date = new Date(time);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};
const ChatList = ({ onSelectChat, selectedChatId, chats }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-0.5">
                {chats.map((chat, index) => (
                    <button
                        key={chat.chatId}
                        onClick={() => onSelectChat?.(chat)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${selectedChatId === chat.chatId ? "bg-gray-100" : "hover:bg-gray-50"
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
                                { chat.profilePhotoUrl ? (
                            <img
                                src={ chat.profilePhotoUrl}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-medium text-gray-700">
                                { chat.chatName.charAt(0).toUpperCase()}
                            </span>
                        )}
                              
                            </div>
                            {chat?.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left py-1">
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-sm font-semibold truncate text-gray-900">
                                    {chat.chatName}
                                </h4>
                                <span className="text-xs shrink-0 ml-2 text-gray-600">
                                    {formatTime(chat.lastMessageTime)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-0.5">
                                <p className="text-sm truncate text-gray-600">
                                    {chat.lastMessage}
                                </p>

                                {chat.unreadCount > 0 && (
                                    <span className="ml-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
