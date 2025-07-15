'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useChatStore from '@/store/chatStore';
import { PlusCircle, LayoutDashboard, X } from 'lucide-react';

const Sidebar = () => {
  const { chatrooms, addChatroom } = useChatStore();
  const pathname = usePathname();
  const router = useRouter();
  const activeId = pathname.split('/chatroom/')[1];

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // 🔍 Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(chatrooms);

  // 🕒 Debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();
      const filtered = chatrooms.filter((room) =>
        room.title.toLowerCase().includes(term)
      );
      setFilteredRooms(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, chatrooms]);

  const handleNavigate = (id) => {
    router.push(`/chatroom/${id}`);
  };

  const handleCreate = () => {
    const title = newTitle.trim();
    if (!title) return;

    const id = Date.now().toString();
    addChatroom({ id, title });
    setNewTitle('');
    setShowModal(false);
    router.push(`/chatroom/${id}`);
  };

  return (
    <>
      {/* Sidebar Layout */}
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-4 hidden sm:flex flex-col justify-between">
        <div>
          {/* Top Buttons */}
          <div className="mb-4 space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="cursor-pointer w-full flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setShowModal(true)}
              // className="cursor-pointer w-full flex items-center gap-2 bg-zinc-200 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              className="cursor-pointer w-full flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <PlusCircle size={16} />
              New Chatroom
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chatrooms..."
            className="mb-4 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded dark:bg-zinc-800 dark:text-white text-sm"
          />

          {/* Chatrooms List */}
          <h2 className="text-md font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Your Chatrooms</h2>
          <ul className="space-y-2 overflow-y-auto max-h-[70vh] pr-1">
            {filteredRooms.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No matching chatrooms.</p>
            ) : (
              filteredRooms.map((room) => (
                <li key={room.id}>
                  <button
                    onClick={() => handleNavigate(room.id)}
                    className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${room.id === activeId
                        ? 'bg-zinc-300 text-black-500'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100'
                      }`}
                  >
                    {room.title}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Create New Chatroom</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
              placeholder="Enter chatroom title"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 rounded border text-sm dark:border-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
