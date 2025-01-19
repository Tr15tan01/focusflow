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
        <body>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col items-center dark:bg-black">
              <NavBar />
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
