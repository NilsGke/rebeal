"use client";
import * as RadixSwitch from "@radix-ui/react-switch";
import { FormEventHandler } from "react";

export default function Switch({
  onChange,
  checked,
}: {
  onChange: FormEventHandler<HTMLButtonElement>;
  checked: boolean;
}) {
  return (
    <RadixSwitch.Root
      onClick={onChange}
      checked={checked}
      className="w-[42px] h-[25px] bg-blackA9 rounded-full relative data-[state=checked]:bg-green-600  bg-zinc-700 cursor-default"
    >
      <RadixSwitch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
    </RadixSwitch.Root>
  );
}
