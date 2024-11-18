'use client'
import { useSession } from "next-auth/react";

export default function TestComponent() {
  const { data: session } = useSession();
  console.log("Session data:", session); // Check if `user.id` is defined here

  return <div>User ID: {session?.user?.id}</div>;
}
