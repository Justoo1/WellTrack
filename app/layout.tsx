import type { Metadata } from "next";
// import {
//   ClerkProvider
// } from '@clerk/nextjs'
import { Kodchasan } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
// import '@fullcalendar/common/main.css'
// import '@fullcalendar/daygrid/main.css'

const kodchasan = Kodchasan({ 
  subsets: ["latin"], 
  weight: ["200","300", "400", "500", "600", "700"]
});


export const metadata: Metadata = {
  title: {
    template: "%s | WELLTRACK",
    default: "WELLTRACK",
  },
  description: "Empleyee Welfare and Event tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kodchasan.className} antialiased bg-bg-img bg-cover bg-black object-cover bg-center bg-blend-luminosity bg-no-repeat`}
      >
        <div className="bg-zinc-950/80 min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
