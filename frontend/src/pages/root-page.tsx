import { Outlet } from "react-router-dom";
import BinanceWebSocket from "../components/websocket";

function RootPage() {
  return (
    <>
      <div>
        <BinanceWebSocket />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
