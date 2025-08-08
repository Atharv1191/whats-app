import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { Menu } from "lucide-react";
import API_BASE_URL from "./config";

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [SidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch(`${API_BASE_URL}/chats`);
        const data = await res.json();
        setChats(data);
        if (data.length > 0) setSelectedChat(data[0]);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    }
    fetchChats();
  }, []);

  return (
    <div className="flex flex-col h-screen relative">
      {/* === Mobile Header === */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        {/* Menu Icon */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Chat Name */}
        <h2 className="flex-1 text-center text-lg font-semibold truncate px-2">
          {selectedChat?.name || selectedChat?.wa_id || "Select a chat"}
        </h2>

        {/* Empty space to balance layout */}
        <div className="w-6" />
      </div>

      {/* === Main Content Area === */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          chats={chats}
          selectedWaId={selectedChat?.wa_id}
          onChatSelect={(chat) => setSelectedChat(chat)}
          SidebarOpen={SidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Chat Window */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedChat ? (
            <ChatWindow key={selectedChat.wa_id} chat={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
