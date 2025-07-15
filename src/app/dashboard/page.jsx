'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import useChatStore from '@/store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import ConfirmToast from '@/components/ConfirmToast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadUser } = useUserStore();
  const { chatrooms, addChatroom, deleteChatroom, loadChatrooms } = useChatStore();

  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadChatrooms();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (!user) return null;

  const handleCreate = () => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return toast.error('Title required');

    if (chatrooms.some(r => r.title.toLowerCase() === trimmedTitle.toLowerCase())) {
      return toast.error('Chatroom with this title already exists');
    }

    addChatroom({ id: uuidv4(), title: trimmedTitle });
    toast.success('Chatroom created');
    setNewTitle('');
  };

  const handleDelete = (id) => {
    const room = chatrooms.find(r => r.id === id);
    if (!room) return;

    ConfirmToast({
      message: `Delete chatroom "${room.title}"?`,
      onConfirm: () => {
        deleteChatroom(id);
        toast.info('Chatroom deleted');
      }
    });
  };

  const handleEnter = (id) => {
    router.push(`/chatroom/${id}`);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome, {user.phone}</h1>

          {/* Input and Create button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Enter chatroom title"
              className="border px-4 py-2 rounded w-full sm:max-w-sm shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-gray-900"
              aria-label="Chatroom title input"
            />
            <button
              onClick={handleCreate}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
              aria-label="Create Chatroom"
            >
              + Create Chatroom
            </button>
          </div>

          {/* Chatroom list */}
          {chatrooms.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No chatrooms yet. Create one above.
            </div>
          ) : (
            <ul className="space-y-4">
              {chatrooms.map((room) => (
                <li
                  key={room.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow transition hover:shadow-md"
                >
                  <span className="text-lg font-medium">{room.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEnter(room.id)}
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded transition"
                      aria-label={`Enter chatroom ${room.title}`}
                    >
                      Enter
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded transition"
                      aria-label={`Delete chatroom ${room.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
