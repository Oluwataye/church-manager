
import { HeaderLogo } from "./HeaderLogo";
import { ChurchHeader } from "./ChurchHeader";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col items-center py-6 border-b">
        <HeaderLogo />
        <ChurchHeader />
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
