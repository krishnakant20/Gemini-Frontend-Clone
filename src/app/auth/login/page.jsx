'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import { Home } from 'lucide-react';

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit number'),
  countryCode: z.string().min(1, 'Country code is required'),
});

const LoginPage = () => {
  const [countries, setCountries] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const { user, setUser, loadUser } = useUserStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,idd')
      .then(res => res.json())
      .then(data => {
        const formatted = data
          .map(c => ({
            name: c.name?.common,
            code: c.idd?.root ? `${c.idd.root}${c.idd.suffixes?.[0] || ''}` : '',
          }))
          .filter(c => c.name && c.code);
        setCountries(formatted);
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  const onSubmit = (data) => {
    if (otpSent) return;
    toast.success('OTP sent!');
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpInput.length === 4) {
      const { phone, countryCode } = getValues();
      setUser({ phone, countryCode });
      toast.success('Logged in!');
      router.push('/dashboard');
    } else {
      toast.error('Please enter a 4-digit OTP');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      {/* Home Button - Top Right Corner */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-1 right-1 flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full transition text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        type="button"
        aria-label="Go to Home"
      >
        <Home size={18} />
        Home
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 p-6 space-y-4 border rounded shadow bg-white dark:bg-black dark:text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Login with OTP</h2>

        <label className="block text-sm font-medium" htmlFor="countryCode">Country Code</label>
        <select
          {...register('countryCode')}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          id="countryCode"
        >
          <option value="">Select country</option>
          {countries.map((c, i) => (
            <option key={i} value={c.code}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
        {errors.countryCode && <p className="text-red-500 text-sm">{errors.countryCode.message}</p>}

        <label className="block text-sm font-medium" htmlFor="phone">Phone Number</label>
        <input
          type="text"
          {...register('phone')}
          placeholder="Enter 10-digit phone number"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          id="phone"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        <button
          type="submit"
          disabled={otpSent}
          className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {otpSent ? 'OTP Sent' : 'Send OTP'}
        </button>

        {/* OTP Section */}
        {otpSent && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500">
              Enter any 4-digit OTP to continue (for demo purposes).
            </p>

            <label className="sr-only" htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              value={otpInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setOtpInput(value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVerifyOtp(); // Trigger OTP verification on Enter key
                }
              }}
              className="w-full p-2 border rounded text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter 4 digit OTP"
              aria-label="Enter 4 digit OTP"
            />


            <button
              type="button"
              onClick={handleVerifyOtp}
              className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Verify OTP
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
