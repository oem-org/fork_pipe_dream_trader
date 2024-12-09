import { Outlet } from "react-router-dom";
import TopNav from "@/components/shared/navigation/top-nav/top-nav";
import Candle from "@/components/shared/chart/"

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
