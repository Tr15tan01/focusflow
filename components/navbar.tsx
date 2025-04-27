// import { UserButton } from "@clerk/nextjs";
// import Logo from "./logo";
// import ThemeSwitcher from "./themeswitcher";

// export default function NavBar() {
//   return (
//     <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px] bg-slate-700">
//       <Logo />
//       navbar
//       <div className="flex gap-4">
//         <UserButton afterSignOutUrl="/" />
//         <ThemeSwitcher />
//       </div>
//     </nav>
//   );
// }

import { UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import ThemeSwitcher from "./themeswitcher";

export default function NavBar() {
  return (
    <nav className="flex w-full items-center justify-between p-4 px-8 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <Logo />
        <span className="text-lg font-medium text-gray-800 dark:text-gray-200 hidden md:inline-block">
          Percentage
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Help"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>

        <ThemeSwitcher />

        <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>

        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
                userButtonPopoverCard: "shadow-lg rounded-lg",
                userButtonPopoverActionButtonText:
                  "text-gray-700 dark:text-gray-200",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline-block">
            Profile
          </span>
        </div>
      </div>
    </nav>
  );
}
