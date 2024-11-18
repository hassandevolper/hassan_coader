'use client';
import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { pusherClient } from '../lib/pusher/pusher';
import { PusherKey } from '../lib/utils/utils';

const FriendRequestSend = ({ incomingFriendRequest, sessionid }) => {
    const router = useRouter();
    const [friendRequests, setFriendRequests] = useState([]);

    const acceptFriend = async (id) => {
        try {
            // Send the friend request accept action to the server using `id`
            await axios.post("/api/friends/accept", { id });

            // Update the friendRequests state to remove the accepted request
            setFriendRequests((prev) =>
                prev.filter((request) => JSON.parse(request.senderid).id !== id)
            );
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const denyFriend = async (id) => {
        try {
            // Send the friend request denial action to the server using `id`
            await axios.post("/api/friends/deny", { id });

            // Filter out the denied request
            setFriendRequests((prev) =>
                prev.filter((request) => JSON.parse(request.senderid).id !== id)
            );
        } catch (error) {
            console.error("Error denying friend request:", error);
        }
    };
 {console.log("session_id_friend_Request_Page",sessionid);
 }
    return (
        <>
            {friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendRequests.map((request) => {
                    const senderData = JSON.parse(request.senderid);

                    return (
                        <div key={senderData.id} className='flex gap-4 items-center'>
                            <UserPlus className='text-black' />
                            <p className='font-medium text-lg'>{senderData.email}</p>
                            <button
                                onClick={() => acceptFriend(senderData.id)}
                                aria-label='Accept Friend'
                                className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
                            >
                                <Check className='font-semibold text-white w-3/4 h-3/4' />
                            </button>
                            <button
                                onClick={() => denyFriend(senderData.id)}
                                aria-label='Deny Friend'
                                className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
                            >
                                <X className='font-semibold text-white w-3/4 h-3/4' />
                            </button>
                        </div>
                    );
                })
            )}
        </>
    );
};

export default FriendRequestSend;
