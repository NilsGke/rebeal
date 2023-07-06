import BackButton from "@/components/BackButton";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className=" relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-start items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton>
            <h1 className="">Settings</h1>
          </BackButton>
        </div>
      </header>
      {children}
    </>
  );
}
