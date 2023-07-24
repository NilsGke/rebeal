import "./globals.css";
import { Inter } from "next/font/google";
import SessionContext from "./app/SessionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ReBeal.",
  description: "A clone of the App BeReal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={
          inter.className + " flex flex-row justify-center items-center"
        }
      >
        <SessionContext>{children}</SessionContext>
      </body>
    </html>
  );
}
