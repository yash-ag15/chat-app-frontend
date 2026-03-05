const ChatPlaceholder = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 px-4">
        <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-gray-200">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-light text-gray-800">
          ChatHub Web
        </h2>
        <p className="text-sm max-w-md text-gray-600">
          Send and receive messages from your browser. Select a chat to start messaging.
        </p>
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            End-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPlaceholder;
