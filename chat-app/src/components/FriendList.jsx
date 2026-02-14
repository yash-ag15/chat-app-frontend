const FriendList = ({ friends, selectedFriendId, onSelectFriend }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
        Friends ({friends.length})
      </h3>
      <div className="space-y-1">
        {friends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => onSelectFriend(friend.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              selectedFriendId === friend.id
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {/* Avatar with status */}
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                selectedFriendId === friend.id ? "bg-blue-400" : "bg-gray-200"
              }`}>
                <span className="text-sm font-medium">
                  {friend.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            
            {/* Name and status text */}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{friend.username}</p>
              <p className={`text-xs ${
                selectedFriendId === friend.id ? "text-blue-100" : "text-gray-500"
              }`}>
                {friend.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
