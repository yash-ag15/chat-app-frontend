import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ENV } from "../../../config.js";

const GroupChatCreator = ({ onGroupCreated }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!isOpen || !search.trim()) {
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

  }, [search, isOpen]);

  const addMember = (friend) => {

    if (members.some((m) => m.chatName === friend.chatName)) return;

    setMembers([...members, friend]);
    setSearch("");
    setResults([]);

  };

  const removeMember = (name) => {

    setMembers(members.filter((m) => m.chatName !== name));

  };

  const createGroup = async () => {

    if (!groupName.trim()) {
      toast.error("Enter group name");
      return;
    }

    if (members.length === 0) {
      toast.error("Select friends");
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${ENV.api_url}/chats/group`,
        {
          chatName: groupName,
          memberUserNames: members.map((m) => m.chatName)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
if(res.status==200){
      toast.success("Group created");

      setGroupName("");
      setMembers([]);
      setSearch("");
      setIsOpen(false);
}
   

    } catch {

      toast.error("Failed to create group");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="border-b px-4 py-3 bg-white">

      <div className="flex justify-between items-center">

        <h3 className="text-sm font-semibold">Create group chat</h3>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-900 text-white text-xs px-3 py-2 rounded"
        >
          {isOpen ? "Close" : "New Group"}
        </button>

      </div>

      {isOpen && (

        <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded">

          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {members.length > 0 && (

            <div className="flex flex-wrap gap-2">

              {members.map((m) => (

                <button
                  key={m.chatName}
                  onClick={() => removeMember(m.chatName)}
                  className="bg-gray-900 text-white px-3 py-1 text-xs rounded-full"
                >
                  {m.chatName} x
                </button>

              ))}

            </div>

          )}

          <div className="max-h-40 overflow-y-auto border rounded bg-white">

            {results.length === 0 ? (

              <p className="p-3 text-sm text-gray-500">
                Start typing to search friends
              </p>

            ) : (

             
                results.map((f) => (
                  <div
                    key={f.chatName}
                    className="flex justify-between items-center px-3 py-2 border-b hover:bg-gray-50"
                  >
                    <p className="text-sm font-bold text-black">
                      {f.chatName}
                    </p>

                    <button
                      onClick={() => addMember(f)}
                      className="text-xs bg-gray-900 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                ))


              )
            }
            

          </div>

          <button
            onClick={createGroup}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded text-sm"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>

        </div>

      )}

    </div>

  );

};

export default GroupChatCreator;