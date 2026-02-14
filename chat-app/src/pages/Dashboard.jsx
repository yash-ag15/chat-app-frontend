import Navbar from "../components/Navbar.jsx";
import FriendList from "../components/FriendList.jsx";
import FriendRequests from "../components/FriendRequests.jsx";
import AddFriend from "../components/AddFriend.jsx";
import ChatPlaceholder from "../components/ChatPlaceholder.jsx";

// Dummy data
const dummyFriends = [
  { id: "1", username: "Alice", status: "online" },
  { id: "2", username: "Bob", status: "offline" },
  { id: "3", username: "Charlie", status: "online" },
  { id: "4", username: "Diana", status: "offline" },
];

const dummyFriendRequests = [
  { id: "req1", senderUsername: "Emma" },
  { id: "req2", senderUsername: "Frank" },
];

const Dashboard = () => {

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar username="JohnDoe" onLogout={() => {}} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <FriendList
              friends={dummyFriends}
              selectedFriendId={null}
              onSelectFriend={() => {}}
            />
            
            <div className="border-t border-gray-200 pt-4">
              <FriendRequests
                requests={dummyFriendRequests}
                onAccept={() => {}}
                onReject={() => {}}
              />
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <AddFriend />
            </div>
          </div>
        </aside>

        {/* Right Panel - Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatPlaceholder />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
