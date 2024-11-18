import SignoutButton from "@/app/components/SignoutButton";
import React from "react";
import { fetchRedis } from "@/app/helper/redis";
import { Icons } from "@/app/components/Icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Friendrequstsidebar from "@/app/components/friendrequstsidebar";
import { getfriendsbyid } from "@/app/helper/get-friends-by-id";
import Sidebarlistchat from "@/app/components/sidebarlistchat";
const Layout = async ({ children }) => {
  const sidebarOption = [
    {
      id: 1,
      name: "Add Friend",
      href: "/dashboard/add",
      icon: <UserPlus className="h-4 w-4" />,
    },
  ];

  const session = await getServerSession(authOptions);
  if (!session) notFound();
  
  const response = await fetchRedis('smembers', `${session.user.id}:incoming_friend_request`);
  const unseenRequestCount = response?.length;

  const friends = await getfriendsbyid(); // Await friends fetch

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        {friends.length > 0 ?  (<div className="text-xs font-semibold leading-6 text-gray-400">
          Your Chats
        </div>) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
                <Sidebarlistchat friends = {friends} session = {session}/>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOption.map((option) => (
                  <li key={option.id} className="flex items-center">
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="flex items-center justify-center">
                        {option.icon}
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                ))}
            <li>
              <Friendrequstsidebar session={session.user.id} unseenrequestcount={unseenRequestCount} />
            </li>
              </ul>
            </li>
            {/* Profile information */}
            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 font-semibold leading-6 text-gray-900">
                {/* Profile Image */}
                <div className="relative h-8 w-8 bg-gray-50 rounded-full overflow-hidden">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full object-cover"
                    src={session.user.image || '/default-profile.jpg'}
                    alt="Your profile picture"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="sr-only">Your Profile</span>
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">{session.user.email}</span>
                </div>
              </div>
              <SignoutButton />
            </li>
          </ul>
        </nav>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;