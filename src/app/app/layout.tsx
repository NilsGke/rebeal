import { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "ReBeal.",
  appleWebApp: true,
  description: 'a clone of the app "BeReal."',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  themeColor: "#000000",
  icons: [
    {
      url: "/logo/icon-192x192.png",
      sizes: "192x192",
    },
    {
      url: "/logo/icon-256x256.png",
      sizes: "256x256",
    },
    {
      url: "/logo/icon-384x384.png",
      sizes: "384x384",
    },
    {
      url: "/logo/icon-512x512.png",
      sizes: "512x512",
    },
  ],
  manifest: "/manifest.json",
  colorScheme: "dark",
};

export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="aspect-[9/16] w-screen min-[500px]:h-screen min-[500px]:w-auto">
      {children}
    </div>
  );
}
