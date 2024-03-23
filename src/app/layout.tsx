import "~/styles/globals.css";
import { Toaster } from "../components/ui/toaster";
import { Kanit } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import AuthProvider from "./_components/auth-provider";
import Navbar from "./_components/navbar";

const kanit = Kanit({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Task Managment",
  description: "App for managing your tasks more efficiently",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen bg-violet-50">
      <body
        className={` ${kanit.className} h-screen bg-violet-50 text-zinc-950`}
      >
        <AuthProvider>
          <Navbar />
          <div className="mx-auto w-11/12 bg-violet-50 md:container">
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
