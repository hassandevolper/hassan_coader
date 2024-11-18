'use client';
import React, { useState } from 'react';
import Button from './button';
import { emailvalidator } from '@/app/lib/validation';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

const AddFriendButton = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(emailvalidator),
  });

  const addFriend = async ({ email }) => {
    try {
      await axios.post("/api/friends/add", { email });
      setShowSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data || "Request failed" });
      } else {
        setError("email", { message: "Something went wrong" });
      }
      setShowSuccess(false);
    }
  };
  
  const onSubmit = (data) => {
    addFriend(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Add Friend by E-mail
        </label>
        <div className="top-2 flex gap-4">
          <input
            type="email"
            {...register("email")}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="you@example.com"
          />
          <Button aria-label="Add Friend">Add</Button>
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        {showSuccess && (
          <p className="mt-1 text-sm text-green-600">Friend Request Sent</p>
        )}
      </form>
    </div>
  );
};

export default AddFriendButton;
