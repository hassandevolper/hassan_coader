import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import { db } from '@/app/utils/redis_db';
import { fetchRedis } from '@/app/helper/redis';
import { messageArrayValidator } from '@/app/lib/utils/messagevalidation';
import Image from 'next/image';
import Messages from '@/app/components/Message';
import ChatInput from '@/app/components/ChatInput';
const getMessages = async (id) => {
  try {
    const result = await fetchRedis('zrange', `chat:${id}:messages`, 0, -1);
    console.log('Fetched messages:', result);

    // Parse messages and handle nested arrays
    const dbMessages = result.flatMap((message) => {
      try {
        const parsedMessage = JSON.parse(message);
        // Ensure the parsed result is an array, flatten if necessary
        return Array.isArray(parsedMessage) ? parsedMessage : [parsedMessage];
                
      } catch (error) {
        console.error("Invalid message format:", message, error);
        return [];
      }
    });

    const reversedMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reversedMessages);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
};

 
const Chats = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const user = session.user.id;
  console.log("Logged-in user:", user);

  // Await params if needed
  const resolvedParams = await Promise.resolve(params);
  const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : String(resolvedParams.id);
  console.log("params.id:", resolvedParams.id);
  
  const [userId1, userId2] = id.split('--').map(decodeURIComponent);
  console.log("userId1:", userId1, "userId2:", userId2);

  if (user !== userId1 && user !== userId2) {
    return notFound();
  }

  const partnerId = user === userId1 ? userId2 : userId1;
  console.log("Partner ID:", partnerId);

  const chatPartnerData = await db.get(`${partnerId}`);
  console.log("Chat partner data:", chatPartnerData);

  if (!chatPartnerData) {
    return notFound();
  }

  const initialMessages = await getMessages(id);
  console.log("Initial messages:", initialMessages);
  if (!initialMessages) {
    return notFound();
  }
  console.log('params:', resolvedParams.id);
 
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
    <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
      <div className='relative flex items-center space-x-4'>
        <div className='relative'>
          <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
            <Image
              fill
              referrerPolicy='no-referrer'
              src={chatPartnerData.image}
              alt={`${chatPartnerData.name} profile picture`}
              className='rounded-full'
            />
          </div>
        </div>

        <div className='flex flex-col leading-tight'>
          <div className='text-xl flex items-center'>
            <span className='text-gray-700 mr-3 font-semibold'>
              {chatPartnerData.name}
            </span>
          </div>

          <span className='text-sm text-gray-600'>{chatPartnerData.email}</span>
        </div>
      </div>
    </div>

    <Messages
  intialmessage = {initialMessages}
  sessionid = {session.user.id}
  sessionimg={session.user.image}
  chatpartnerimg={chatPartnerData.image}
    />
    <ChatInput chatPartnerEmail = {chatPartnerData.email} chatId = {id} />
  </div>

  );
};

export default Chats;
