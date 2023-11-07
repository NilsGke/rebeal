import { twMerge } from "tailwind-merge";

export default function Block({
  title,
  children,
  className = "",
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {title && <h2 className="text-xs mt-2 font-bold">{title}</h2>}
      <div
        className={twMerge(
          "p-3 rounded-xl bg-zinc-900 flex flex-col gap-3 flex-nowrap",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
