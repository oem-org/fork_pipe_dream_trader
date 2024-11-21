
import { Outlet } from "react-router-dom"
import NavBar from "../components/navigation-bars/NavBar"

function Root() {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet />
    </div>
  )
}

export default Root
