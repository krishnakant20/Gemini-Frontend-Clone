import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem('chat_user', JSON.stringify(user));
    set({ user });
  },
  loadUser: () => {
    const stored = localStorage.getItem('chat_user');
    if (stored) {
      set({ user: JSON.parse(stored) });
    }
  },
  logout: () => {
    localStorage.clear(); 
    set({ user: null });
  }

}));

export default useUserStore;
