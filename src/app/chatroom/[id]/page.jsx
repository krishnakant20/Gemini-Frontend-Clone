'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useChatStore from '@/store/chatStore';
import useUserStore from '@/store/userStore';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ImageUp } from 'lucide-react';

const MESSAGES_PER_PAGE = 20;

export default function ChatroomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loadUser } = useUserStore();
  const { chatrooms } = useChatStore();

  const [allMessages, setAllMessages] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [aiQueue, setAiQueue] = useState([]);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user]);

  const chatroom = chatrooms.find((c) => c.id === id);

  useEffect(() => {
    if (!chatroom) return;
    const stored = JSON.parse(localStorage.getItem('chat_messages') || '{}');
    const chatMessages = stored[id] || [];

    setAllMessages(chatMessages);
    const start = Math.max(0, chatMessages.length - MESSAGES_PER_PAGE);
    setDisplayedMessages(chatMessages.slice(start));
    setPage(1);
    setHasLoadedMessages(true);
  }, [id, chatroom]);

  useEffect(() => {
    if (!chatroom || !hasLoadedMessages) return;
    const stored = JSON.parse(localStorage.getItem('chat_messages') || '{}');
    stored[id] = allMessages;
    localStorage.setItem('chat_messages', JSON.stringify(stored));
  }, [allMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  useEffect(() => {
    if (aiQueue.length > 0 && !isTyping) handleAiResponse();
  }, [aiQueue, isTyping]);

  const handleAiResponse = () => {
    const next = aiQueue[0];
    if (!next) return;

    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        from: 'gemini',
        content: `Gemini's reply to: "${next}"`,
        time: new Date().toLocaleTimeString(),
        type: 'text',
      };
      const updated = [...allMessages, reply];
      setAllMessages(updated);
      setDisplayedMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      setAiQueue((prev) => prev.slice(1));
    }, 2000);
  };

  const sendMessage = () => {
    if (!input.trim() && !image) return;

    const newMessages = [];

    if (input.trim()) {
      newMessages.push({
        from: 'user',
        content: input.trim(),
        time: new Date().toLocaleTimeString(),
        type: 'text',
      });
    }

    if (image) {
      newMessages.push({
        from: 'user',
        content: image,
        time: new Date().toLocaleTimeString(),
        type: 'image',
      });
    }

    const updated = [...allMessages, ...newMessages];
    setAllMessages(updated);
    setDisplayedMessages((prev) => [...prev, ...newMessages]);

    if (input.trim()) {
      setAiQueue((prev) => [...prev, input.trim()]);
    } else if (image) {
      setAiQueue((prev) => [...prev, '[Image uploaded]']);
    }

    setInput('');
    setImage(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Message copied!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => setImage(null);

  const loadOlderMessages = () => {
    const start = Math.max(0, allMessages.length - (page + 1) * MESSAGES_PER_PAGE);
    const end = allMessages.length - page * MESSAGES_PER_PAGE;
    const older = allMessages.slice(start, end);
    if (older.length > 0) {
      setDisplayedMessages((prev) => [...older, ...prev]);
      setPage((prev) => prev + 1);
    }
  };

  const onScroll = () => {
    if (scrollRef.current.scrollTop === 0) {
      loadOlderMessages();
    }
  };

  if (!chatroom) return <p className="p-6">Chatroom not found.</p>;

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col p-4">
          {/* Mobile Dashboard Button */}
          <div className="sm:hidden mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">Chatroom: {chatroom.title}</h2>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex-1 overflow-y-auto rounded p-4 space-y-3 mb-4 bg-white dark:bg-zinc-900 shadow-md"
            // className="flex-1 overflow-y-auto border rounded p-4 space-y-3 mb-4 bg-white dark:bg-zinc-900"
            style={{ maxHeight: '65vh' }}
          >
            {displayedMessages.map((msg, i) => (
              <div
                key={i}
                onClick={() => msg.type !== 'image' && handleCopy(msg.content)}
                title={msg.type !== 'image' ? 'Click to copy' : ''}
                // className={`max-w-[80%] break-words px-4 py-2 rounded-lg shadow text-sm cursor-pointer ${msg.from === 'user'
                //   ? 'border border-indigo-500 bg-zinc-200 text-white ml-auto'
                //   : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white'
                //   }`}
                className={`max-w-[80%] break-words px-4 py-2 rounded-lg shadow-sm text-sm cursor-pointer ${msg.from === 'user'
                    ? 'ml-auto bg-sky-100 text-indigo-900 border border-indigo-400'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white'
                  }`}

              >
                {msg.type === 'image' ? (
                  <img src={msg.content} alt="Uploaded" className="max-w-full rounded" />
                ) : (
                  <p>{msg.content}</p>
                )}
                <span className="block text-xs mt-1 opacity-70">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="text-sm italic text-gray-500">Gemini is typing...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input and Image Upload */}
          <div className="flex flex-col gap-2">
            {image && (
              <div className="flex items-center gap-3 mb-2">
                <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                <button
                  onClick={removeImage}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex gap-2 items-center p-3 rounded-lg shadow-md bg-white dark:bg-zinc-900">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // prevent newline
                    sendMessage();
                  }
                }}
                className="flex-1 rounded px-4 py-2 dark:bg-zinc-800 dark:text-white"
                placeholder="Type your message..."
                aria-label="Type your message"
                aria-describedby="send-instruction"
              />


              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm bg-gray-300 px-3 py-2 rounded"
              >
                <ImageUp size={18} />
              </label>

              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                aria-label="Send message"
              >
                Send
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
