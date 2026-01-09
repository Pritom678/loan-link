import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `relative font-medium px-4 py-2 rounded-md transition-all duration-200 nav-link ${
      location.pathname === path
        ? "text-primary bg-primary/10"
        : "text-gray-600 hover:text-primary hover:bg-primary/5"
    }`;

  const navLinks = (
    <>
      <Link to="/" className={linkClass("/")}>
        Home
      </Link>

      <Link to="/all-loans-options" className={linkClass("/all-loans-options")}>
        All Loans
      </Link>

      <Link to="/about" className={linkClass("/about")}>
        About Us
      </Link>

      <Link to="/contact" className={linkClass("/contact")}>
        Contact
      </Link>
    </>
  );

  return (
    <div className="sticky top-0 w-full bg-white navbar-bg z-20 shadow-sm border-b border-gray-100">
      <div className="py-3">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            {/* Left - Logo */}
            <Logo />

            {/* Center Nav (Only Desktop) */}
            <div className="hidden md:flex items-center gap-2">{navLinks}</div>

            {/* Right - Theme Toggle & Dropdown Menu */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="relative">
                <div
                  className="p-2 border border-gray-200 flex items-center gap-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors nav-menu-button"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <AiOutlineMenu className="w-5 h-5 text-gray-600 nav-menu-icon" />
                  <img
                    className="rounded-full hidden md:block"
                    src={user?.photoURL || avatarImg}
                    alt="profile"
                    width="28"
                    height="28"
                  />
                </div>

                {/* Dropdown */}
                {isOpen && (
                  <div className="absolute rounded-lg shadow-lg w-[50vw] md:w-[200px] bg-white nav-dropdown border border-gray-200 right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer py-2">
                      {/* Mobile Links in Dropdown */}
                      <div className="md:hidden flex flex-col border-b border-gray-200 pb-2 mb-2">
                        {navLinks}
                      </div>

                      {user ? (
                        <>
                          <Link
                            to="/dashboard"
                            className="px-4 py-2 hover:bg-gray-50 font-medium text-gray-700 nav-dropdown-item"
                          >
                            Dashboard
                          </Link>
                          <div
                            onClick={logOut}
                            className="px-4 py-2 hover:bg-gray-50 font-medium text-gray-700 nav-dropdown-item"
                          >
                            Logout
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="px-4 py-2 hover:bg-gray-50 font-medium text-gray-700 nav-dropdown-item"
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="px-4 py-2 hover:bg-gray-50 font-medium text-gray-700 nav-dropdown-item"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
