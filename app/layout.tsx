"use client";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="flex flex-col h-screen items-center">
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
            disableTransitionOnChange
          >
            <NavBar />
            <div className="flex flex-col max-w-7xl  mx-auto h-screen items-center justify-center p-4 px-8 bg-red-600 dark:bg-black">
              <Separator />
              {/* <main className="flex flex-grow w-full justify-center dark:bg-neutral-950"> */}
              {children}
              {/* </main> */}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
