// components/Sidebar.jsx
import React from 'react'
import { X } from 'lucide-react'

export default function Sidebar({ chats, onChatSelect, selectedWaId, SidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`${
        SidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 fixed sm:relative top-0 left-0 w-64 h-full bg-white shadow-md z-40 transform transition-transform duration-300`}
    >
      {/* Mobile close button */}
      <div className="flex justify-between items-center p-4 sm:hidden border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Chat list */}
      <ul className="overflow-y-auto max-h-[calc(100%-4rem)] p-2">
        {chats.map((chat) => (
          <li
            key={chat.wa_id}
            onClick={() => {
              onChatSelect(chat)
              setSidebarOpen(false) 
            }}
            className={`cursor-pointer p-3 rounded hover:bg-gray-100 ${
              chat.wa_id === selectedWaId ? 'bg-gray-200 font-medium' : ''
            }`}
          >
            {chat.name || chat.wa_id}
          </li>
        ))}
      </ul>
    </div>
  )
}
