import SideNav from "@/app/components/shared/navigation/side-nav";
import { TopNav } from "../components/shared/navigation/top-nav/top-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (

    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="flex  flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    </div>
  );
}
