'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Set to false to handle redirect manually
    });

    if (result?.error) {
      // Handle error (e.g., show a message to the user)
      console.error(result.error);
    } else {
      // Redirect to the home page after successful sign-in
      router.push('/'); // Change this to the desired route after successful sign-in
    }

    // Clear the fields
    setEmail('');
    setPassword('');
  };

  const handleClick = async () => {
    setIsLoading(true); // Set loading state to true
    const result = await signIn("github");
    if (!result.error) {
      router.push('/'); // Redirect after successful sign-in
    } else {
      console.error(result.error); // Handle error if needed
    }
    setIsLoading(false); // Reset loading state
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 flex items-center justify-center px-4 text-black">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Sign In</h2>
        <form onSubmit={handleSubmit}> {/* Wrap inputs in a form */}
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-black">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password" 
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm my-4">
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">Forgot password?</a>
          </div>

          {/* Sign in with GitHub */}
          <div className="mt-6 my-4">
            <button
              type="button"
              onClick={handleClick}
              className={`w-full px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-gray-900'} text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out flex items-center justify-center`}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0114.14 14.14A10 10 0 014.93 4.93z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.84 10.95.57.1.75-.24.75-.53v-1.93c-3.18.69-3.84-1.36-3.84-1.36-.52-1.34-1.27-1.69-1.27-1.69-.88-.6.07-.59.07-.59 1.03.07 1.58 1.07 1.58 1.07.9 1.54 2.36 1.09 2.94.83.09-.66.35-1.1.63-1.35-2.54-.29-5.22-1.27-5.22-5.66 0-1.25.45-2.26 1.19-3.06-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.86 10.86 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.76.11 3.05.74.8 1.19 1.81 1.19 3.06 0 4.4-2.69 5.37-5.25 5.65.36.31.68.93.68 1.88v2.8c0 .3.18.64.75.53A10.49 10.49 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
                </svg>
              )}
              Sign in with GitHub
            </button>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
