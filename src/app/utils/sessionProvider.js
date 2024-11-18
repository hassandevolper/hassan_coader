'use client'
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};