"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
// import {  } from "@radix-ui/react-tabs";
import { Computer, MoonIcon, SunIcon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tabs defaultValue={theme}>
      <TabsList className="bg-slate-500 text-white">
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <SunIcon />
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
          <MoonIcon />
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => setTheme("system")}>
          <Computer />
        </TabsTrigger>
      </TabsList>
    </Tabs>
    // <h3>hi</h3>
  );
}
