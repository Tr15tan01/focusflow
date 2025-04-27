// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
// // import {  } from "@radix-ui/react-tabs";
// import { Computer, MoonIcon, SunIcon } from "lucide-react";

// export default function ThemeSwitcher() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <Tabs defaultValue={theme}>
//       <TabsList className="bg-slate-500 text-white">
//         <TabsTrigger value="light" onClick={() => setTheme("light")}>
//           <SunIcon />
//         </TabsTrigger>
//         <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
//           <MoonIcon />
//         </TabsTrigger>
//         <TabsTrigger value="system" onClick={() => setTheme("system")}>
//           <Computer />
//         </TabsTrigger>
//       </TabsList>
//     </Tabs>
//     // <h3>hi</h3>
//   );
// }

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-transparent"
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
