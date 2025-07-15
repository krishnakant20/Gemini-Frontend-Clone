import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  chatrooms: [],
  addChatroom: (room) => {
    const updated = [...get().chatrooms, room];
    localStorage.setItem('chat_chatrooms', JSON.stringify(updated));
    set({ chatrooms: updated });
  },
  deleteChatroom: (id) => {
    const updated = get().chatrooms.filter(r => r.id !== id);
    localStorage.setItem('chat_chatrooms', JSON.stringify(updated));
    set({ chatrooms: updated });
    // Optional: also clear messages for deleted room
    const all = JSON.parse(localStorage.getItem('chat_messages') || '{}');
    delete all[id];
    localStorage.setItem('chat_messages', JSON.stringify(all));
  },
  loadChatrooms: () => {
    const stored = localStorage.getItem('chat_chatrooms');
    if (stored) {
      set({ chatrooms: JSON.parse(stored) });
    }
  },
}));

export default useChatStore;
