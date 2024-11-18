'use client'
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { chathrefconstructore } from '../lib/utils/utils';

const Sidebarlistchat = ({ friends, session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState([]);

  useEffect(() => {
    if (pathname.includes("chats")) {
      setUnseenMessages((prev) => prev.filter((msg) => !pathname.includes(msg.senderid)));
    }
  }, [pathname]);

  const handleNavigation = (friendId) => {
    const href = `/dashboard/chats/${chathrefconstructore(session.user.id, friendId)}`;
    router.push(href);
  };

  return (
    <div>
      <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {friends.map((friend) => {
          const unseenMessagesCount = unseenMessages.filter((msg) => msg.senderid === friend.id).length;

          return (
            <li key={friend.id}>
              <button
                onClick={() => handleNavigation(friend.id)}
                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left'
              >
                {friend.email}
                {unseenMessagesCount > 0 && (
                  <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex items-center justify-center'>
                    {unseenMessagesCount}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebarlistchat;
