'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="text-center">
        <Image
          src="/gemini-logo.png"
          alt="Gemini Logo"
          width={100}
          height={100}
          className="mx-auto mb-6 dark:invert"
        />
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Gemini</h1>
        <p className="text-lg sm:text-xl mb-8">Conversational AI assistant</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all text-base sm:text-lg"
        >
          Login to Continue
        </button>
      </div>
    </div>
  );
}
