import { Outlet } from "react-router-dom";
import TopNav from "@/components/shared/navigation/top-nav/top-nav";

function Root() {
  return (
    <div>
      <TopNav></TopNav>
      <Outlet />
    </div>
  );
}

export default Root;
