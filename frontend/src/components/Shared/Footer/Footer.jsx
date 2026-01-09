import React from "react";
import { Link } from "react-router";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 footer-bg text-gray-300 py-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Company Info */}
          <div className="flex items-center gap-4">
            <Logo />
            <div className="text-sm text-gray-400">
              Your trusted loan platform
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="footer-link text-gray-300">
              Home
            </Link>
            <Link to="/about" className="footer-link text-gray-300">
              About
            </Link>
            <Link to="/all-loans-options" className="footer-link text-gray-300">
              Loans
            </Link>
            <Link to="/contact" className="footer-link text-gray-300">
              Contact
            </Link>
            <Link to="/faq" className="footer-link text-gray-300">
              FAQ
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-400 text-center md:text-right">
            <div>support@loanlink.com</div>
            <div>1-800-LOAN-LINK</div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} LoanLink. All rights reserved. |{" "}
          <Link to="/privacy-policy" className="hover:text-gray-300">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="/terms-of-service" className="hover:text-gray-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
