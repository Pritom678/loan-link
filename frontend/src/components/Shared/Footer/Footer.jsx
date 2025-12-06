import React from "react";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-amber-800 text-gray-300 py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Logo & Description */}
        <div className="flex-1">
          <Logo />
          <p className="text-gray-400">
            LoanLink is your trusted platform for easy and fast loan solutions.
            We provide transparent services to help you achieve your financial
            goals.
          </p>
        </div>

        {/* Useful Links */}
        <div className="flex-1 md:flex md:justify-center md:items-center md:flex-col">
          <h3 className="text-white font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LoanLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
