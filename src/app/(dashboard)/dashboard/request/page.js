import React from 'react'
import FriendRequestsend from '@/app/components/FriendRequest'
import { fetchRedis } from '@/app/helper/redis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const FriendRequest = async() => {
    let session = await getServerSession(authOptions)
    const senderids =  await fetchRedis(`smembers`,`${session.user.id}:incoming_friend_request`)
    const incomming_friend_request = await Promise.all(
        senderids.map( async(sender_id)=>{
            const senderid = await fetchRedis(`get`,`${sender_id}`)
            return{
                senderid : senderid,
            }
        })
    )
    console.log("sender_id",senderids);
    console.log("incomming_friend_request",incomming_friend_request);
    
  return (
    <div className='pt-8'>
        <h1 className=' font-bold text-5xl mb-5'>Add a friend</h1>
        <div className=' flex flex-col gap-4'>
            <FriendRequestsend incomingFriendRequest = {incomming_friend_request} sessionid = {session.user.id}/>
        </div>
      
    </div>
  )
}

export default FriendRequest
