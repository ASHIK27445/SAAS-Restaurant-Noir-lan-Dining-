import { Outlet } from "react-router"
import Navbar from "./pages/Navbar"
import Footer from "./pages/Footer"

function App() {


  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}

export default App
