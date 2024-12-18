import { Outlet } from "react-router-dom";
import TopNav from "@/components/ui/navigation/top-nav";

function RootPage() {

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-800">
        <TopNav />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
