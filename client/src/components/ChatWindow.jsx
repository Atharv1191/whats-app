import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon, SendHorizonal } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ use env variable

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/${chat.wa_id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wa_id: chat.wa_id,
          name: chat.name,
          text: text.trim(),
        }),
      });
      setText('');
      setImage(null);
      const res = await fetch(`${API_BASE_URL}/api/messages/${chat.wa_id}`);
      const updatedMessages = await res.json();
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chat) return null;

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 sm:px-6 bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-300">
        <div>
          <p className="font-semibold text-slate-800 text-base sm:text-lg">{chat.name || chat.wa_id}</p>
          <p className="text-sm text-gray-500 -mt-1">@{chat.wa_id}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
          )}
          {messages
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message, index) => {
              const isOwn = message.from !== chat.wa_id;
              return (
                <div key={message.message_id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 max-w-[80%] text-sm rounded-lg shadow ${isOwn ? 'bg-green-100 rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                    {message.type === 'image' && message.media_url && (
                      <img src={message.media_url} alt="attachment" className="w-full max-w-sm rounded-lg mb-2" />
                    )}
                    <p>{message.text}</p>
                    <div className="text-xs text-gray-400 mt-1 text-right flex justify-end items-center gap-2">
                      {new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className={`font-semibold ${message.status === 'read' ? 'text-blue-600' : message.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-5 bg-gray-50">
        <div className="flex items-center gap-3 pl-5 pr-3 py-2 bg-white w-full max-w-2xl mx-auto border border-gray-200 shadow rounded-full">
          <input
            type="text"
            disabled={loading}
            className="flex-1 text-sm text-slate-700 placeholder:text-gray-400 focus:outline-none"
            placeholder="Type a message"
            onKeyDown={handleKeyDown}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <label htmlFor="image" className="cursor-pointer">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" className="w-6 h-6 rounded object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-500" />
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <button
            disabled={loading}
            onClick={sendMessage}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 text-white p-2 rounded-full disabled:opacity-50"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
