import { Outlet } from "react-router-dom";
import NavbarContainer from "../../components/Layouts/Navbar";
const Layout = () => {
  return (
    <>
      <NavbarContainer />
      <main className="py-3">
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;