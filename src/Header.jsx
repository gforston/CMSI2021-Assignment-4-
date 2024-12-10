import React from "react";
import { SignIn, SignOut } from "./Auth"; // Adjust the path based on your file structure
import logo from "./assets/logo.png"; // Adjust the path based on your file structure

function Header({ user }) {
  return (
    <header className="header">
      <div className="title">
        Fantasy Faceoff
        <img src={logo} alt="Fantasy Faceoff Logo" className="title-image" />
      </div>
      <div className="sign-in">{!user ? <SignIn /> : <SignOut />}</div>
    </header>
  );
}

export default Header;