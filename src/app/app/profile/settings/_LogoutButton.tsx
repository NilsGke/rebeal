"use client";
import { signOut } from "next-auth/react";

const LogoutButton = () => (
  <button
    className="text-red-500"
    onClick={() => signOut({ callbackUrl: process.env.NEXTAUTH_URL })}
  >
    Logout
  </button>
);

export default LogoutButton;
