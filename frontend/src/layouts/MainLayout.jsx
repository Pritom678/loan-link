import { Outlet } from "react-router";
import Navbar from "../components/Shared/Navbar/Navbar";
import Footer from "../components/Shared/Footer/Footer";
import ScrollToTop from "../components/Shared/ScrollToTop/ScrollToTop";
import Breadcrumb from "../components/Shared/Breadcrumb/Breadcrumb";
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Breadcrumb />
      <div className="pt-24 min-h-[calc(100vh-68px)]">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
