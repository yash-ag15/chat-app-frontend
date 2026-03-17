import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ENV } from "../../../config.js";

const GroupMembersManager = ({ selectedChat }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const isGroup = selectedChat?.isGroup === true;

  // reset when chat changes
  useEffect(() => {
    setSearch("");
    setResults([]);
    setIsOpen(false);
  }, [selectedChat?.chatId]);

  // search friends
  useEffect(() => {

    if (!isOpen || !search.trim() || !isGroup) {
      setResults([]);
      return;
    }

    const searchFriends = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${ENV.api_url}/friends/search?prefix=${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setResults(res.data || []);

      } catch {

        toast.error("Failed to search friends");

      }

    };

    searchFriends();

  }, [search, isOpen, isGroup]);

  // add member
  const addMember = async (friend) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `${ENV.api_url}/chats/${selectedChat.chatId}/members`,
        {
          memberUserNames: [friend.chatName]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`${friend.chatName} added to group`);

      setSearch("");
      setResults([]);

    } catch {

      toast.error("Failed to add member");

    }

  };

  if (!isGroup) return null;

  return (

    <div className="border-b px-4 py-3 b">

      <div className="flex justify-between items-center">

        <h3 className="text-sm font-semibold">Manage group members</h3>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-100 px-3 py-2 text-xs rounded"
        >
          {isOpen ? "Hide" : "Add Members"}
        </button>

      </div>

      {isOpen && (

        <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friend"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <div className="max-h-40 overflow-y-auto border rounded bg-white">

            {results.length === 0 ? (

              <p className="p-3 text-sm text-gray-500">
                Type a name to search friends
              </p>

            ) : (

              results.map((friend) => (

                <button
                  key={friend.chatName}
                  onClick={() => addMember(friend)}
                  className="w-full text-left px-3 py-2 border-b hover:bg-gray-50"
                >
                  {friend.chatName}
                </button>

              ))

            )}

          </div>

        </div>

      )}

    </div>

  );

};

export default GroupMembersManager;