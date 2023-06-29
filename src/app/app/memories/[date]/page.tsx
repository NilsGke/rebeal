import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default async function MemoryDate({
  params,
}: {
  params: { date: string };
}) {
  // 06-01-2023
  const [month, day, year] = params.date.split("-").map((s) => parseInt(s));
  console.log(year, month, day);

  const date = new Date(year, month - 1, day);
  return (
    <>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton className="flex gap-3 justify-center items-center">
            <span className="flex items-center justify-center">Memories</span>
          </BackButton>
        </div>
      </header>
      {date.toString()}
      <Link href={""}>&lt;-</Link>
      <Link href={""}>-&gt;</Link>
    </>
  );
}
