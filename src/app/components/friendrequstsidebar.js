'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

const FriendRequestSidebar = ({ unseenrequestcount, session }) => {
  const [unseenCount, setUnseenCount] = useState(unseenrequestcount)

  useEffect(() => {
    setUnseenCount(unseenrequestcount)
  }, [unseenrequestcount])

  return (
    <div>
      <Link href="/dashboard/request" className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center rounded-md p-2 text-sm leading-6 font-semibold">
        <div className="text-gray-400 border-gray-200 group-hover:text-indigo-600 flex w-6 h-6 shrink-0 items-center justify-center rounded-lg border text-[0.635rem] font-medium">
          <UserPlus className="w-4 h-4" />
        </div>
        <p className="truncate ml-2">Friend Request</p>
        {unseenCount > 0 && (
          <div className="ml-2 rounded-full h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-semibold">
            {unseenCount}
          </div>
        )}
      </Link>
    </div>
  )
}

export default FriendRequestSidebar
