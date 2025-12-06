import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import Logo from "../Logo";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `relative font-semibold px-4 py-2 transition-all ${
      location.pathname === path
        ? "text-primary underline underline-offset-4 hover:bg-base-200"
        : "text-neutral-600"
    } group`;

  const navLinks = (
    <>
      <Link to="/" className={linkClass("/")}>
        Home
        {/* hover bg sliding box */}
        <span className="absolute left-0 bottom-0 w-full h-full bg-primary/10 rounded-md scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10"></span>
      </Link>

      <Link to="/loans" className={linkClass("/loans")}>
        All Loans
        <span className="absolute left-0 bottom-0 w-full h-full bg-primary/10 rounded-md scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10"></span>
      </Link>

      <Link to="/about" className={linkClass("/about")}>
        About Us
        <span className="absolute left-0 bottom-0 w-full h-full bg-primary/10 rounded-md scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10"></span>
      </Link>

      <Link to="/contact" className={linkClass("/contact")}>
        Contact
        <span className="absolute left-0 bottom-0 w-full h-full bg-primary/10 rounded-md scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 -z-10"></span>
      </Link>
    </>
  );

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            {/* Left - Logo */}
            <Logo />

            {/* Center Nav (Only Desktop) */}
            <div className="hidden md:flex items-center gap-6 font-semibold">
              {navLinks}
            </div>

            {/* Right - Dropdown Menu */}
            <div className="relative">
              <div
                className="p-3 border border-neutral-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AiOutlineMenu />
                <img
                  className="rounded-full hidden md:block"
                  src={user?.photoURL || avatarImg}
                  alt="profile"
                  width="30"
                  height="30"
                />
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[50vw] md:w-[12vw] bg-white right-0 top-12 text-sm">
                  <div className="flex flex-col cursor-pointer">
                    {/* Mobile Links in Dropdown */}
                    <div className="md:hidden flex flex-col border-b border-neutral-200   font-semibold">
                      {navLinks}
                    </div>

                    {user ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="px-4 py-3 hover:bg-base-200 font-semibold"
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={logOut}
                          className="px-4 py-3 hover:bg-base-200 font-semibold"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="px-4 py-3 hover:bg-base-200 font-semibold"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="px-4 py-3 hover:bg-base-200 font-semibold"
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
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
