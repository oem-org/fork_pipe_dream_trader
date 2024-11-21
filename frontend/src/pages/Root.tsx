
import { Outlet } from "react-router-dom"
import NavBar from "../components/NavigationBars/NavBar"

function Root() {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet />
    </div>
  )
}

export default Root
