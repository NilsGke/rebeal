"use client";

import { Menu } from "@headlessui/react";
import { ReactNode } from "react";

type props = {
  buttonContent: ReactNode;
  items: ReactNode[];
};

export default function DropDown({ buttonContent, items }: props) {
  return (
    <Menu>
      <Menu.Button>{buttonContent}</Menu.Button>
      <Menu.Items className="z-20 flex flex-col gap-1 absolute top-9 right right-0 p-2 mt-2 w-56 origin-top-right rounded-md bg-zinc-900 shadow-lg focus:outline-none">
        {items.map((item, index) => {
          return (
            <Menu.Item key={index}>
              {({ active }) => (
                <div
                  className={`${
                    active ? "bg-zinc-800" : "bg-zinc-900"
                  } text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <>{item}</>
                </div>
              )}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
}
