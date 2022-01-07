import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div>
        <Link to="/home">Home</Link>
        <Link to="/demo">Demo</Link>
      </div>
      <br />
    </div>
  );
};

export default Navbar;
