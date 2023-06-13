"use client";
import { SessionProvider } from "next-auth/react";

interface SessionContextProps {
  children: React.ReactNode;
}

const SessionContext: React.FunctionComponent<SessionContextProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionContext;
