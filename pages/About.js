import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Demo from "./Demo";
const About = () => {
  return (
    <>
      {/* <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </BrowserRouter> */}
    </>
  );
};

export default About;
