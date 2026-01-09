import React from "react";
import logo from "../../assets/images/logo-flat.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="w-[100px] overflow-visible">
      <Link to="/">
        <img
          src={logo}
          alt="logo"
          className="w-[150px] h-auto transform scale-150 origin-left logo-image"
        />
      </Link>
    </div>
  );
};

export default Logo;
