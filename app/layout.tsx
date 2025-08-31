// "use client";

import { Metadata } from "next";
// import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Separator } from "@radix-ui/react-separator";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Focus Timer",
  description: "Focus Timer app.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

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
    // <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen items-center">
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NavBar />
          <div className="flex flex-col w-full md:w-3/4 mx-auto min-h-screen items-center justify-center">
            <Separator />
            {/* <main className="flex flex-grow w-full justify-center dark:bg-neutral-950"> */}
            {children}
            {/* </main> */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
