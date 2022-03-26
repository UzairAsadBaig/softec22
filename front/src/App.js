import {
  Routes,
  Route,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Sidenavbar from "./components/Sidenavbar";
import Home from "./pages/Home";
import Profile from "./components/Profile";


function App() {
  return (
    <>
      <Signin />
      {/* <Routes>
        <Route path="/" exact element={<Home />} />
      </Routes> */}

      {/* <Signup/> */}
      {/* <Signin/> */}
      <Profile />


      {/* <Signup/> */}
      <Home></Home>
    </>
  );
}

export default App;