"use client";
import { signOut } from "next-auth/react";

const LogoutButton = () => (
  <button
    className="text-red-500"
    onClick={() =>
      signOut({
        callbackUrl: "http://127.0.0.1:3000", // TODO: PROD
      })
    }
  >
    Logout
  </button>
);

export default LogoutButton;
