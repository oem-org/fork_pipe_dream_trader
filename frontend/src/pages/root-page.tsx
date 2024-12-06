import { Outlet } from "react-router-dom";
import TopNav from "@/components/shared/navigation/top-nav/top-nav";
function RootPage() {

  return (
    <>
      <div>
        <TopNav />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
