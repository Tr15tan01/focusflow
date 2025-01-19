// "use client";

// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { ReactNode } from "react";

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   return (
//     <NextThemesProvider attribute="class" enableSystem>
//       {children}
//     </NextThemesProvider>
//   );
// }

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
