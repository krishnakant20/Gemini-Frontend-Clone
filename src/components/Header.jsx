'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import { User, Moon, Sun } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="w-full px-6 py-3 bg-gradient-to-r from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 shadow border-b flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide text-zinc-800 dark:text-white">
        Gemini Clone
      </h1>

      {user && (
        <div className="flex items-center gap-4">
          {/* Avatar or icon */}
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            <User size={16} />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-yellow-400 transition"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Phone */}
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
            {user.countryCode} {user.phone}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="cursor-pointer bg-zinc-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
