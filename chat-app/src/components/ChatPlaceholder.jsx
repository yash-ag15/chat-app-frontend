const ChatPlaceholder = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
          <span className="text-4xl">💬</span>
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Select a friend to start chatting
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Choose a friend from the sidebar to begin your conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPlaceholder;
