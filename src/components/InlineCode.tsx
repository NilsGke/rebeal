import { FC, ReactNode } from "react";

const InlineCode: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="ml-1 p-1 rounded text-red-400 bg-zinc-700">{children}</div>
  );
};

export default InlineCode;
