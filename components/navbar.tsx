import { UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import ThemeSwitcher from "./themeswitcher";

export default function NavBar() {
  return (
    <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
      <Logo />
      navbar
      <div className="flex gap-4">
        <UserButton afterSignOutUrl="/" />
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
