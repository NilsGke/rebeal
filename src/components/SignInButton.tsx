"use client";

import { signIn } from "next-auth/react";
import { ReactNode } from "react";

const SignInButton: React.FC<{ className?: string; children?: ReactNode }> = ({
  className = "",
  children,
}) => {
  return (
    <button className={className} onClick={() => signIn()}>
      {children}
    </button>
  );
};

export default SignInButton;
