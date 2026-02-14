const FriendRequests = ({ requests, onAccept, onReject }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
        Friend Requests ({requests.length})
      </h3>
      <div className="space-y-2">
        {requests.length === 0 ? (
          <p className="text-xs text-gray-500 px-2 py-2">No pending requests</p>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg"
            >
              {/* Sender info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {request.senderUsername.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {request.senderUsername}
                </span>
              </div>
              
              {/* Accept/Reject buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => onAccept(request.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-green-600 hover:bg-green-100 transition"
                >
                  ✓
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
