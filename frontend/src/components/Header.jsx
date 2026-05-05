import React, { useContext, useState } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import joe from "./images/joe.jpg";
import Noura from "./images/Noura.jpg";

const Header = () => {
  const { IsLoggedIn, setIsLoggedIn, User, Profile, image } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Etes-vous sûr(e) de vouloir vous déconnecter ?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
    }
  };

  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <Link className="navbar-brand text-light " to="/">
          <span style={{color:"red"}}>LK2D</span> <span style={{color:"deepskyblue", fontStyle:"oblique"}}>Book'Store</span>
        </Link>
        {IsLoggedIn ? (
          <div className="d-flex align-items-start">
            <button onClick={handleLogout} className="btn btn-danger  me-4">
              Logout
            </button>

            <Link to={"/profile"}>
              <img
                style={{
                 borderRadius: "50%",
                }}
                src={Profile[0]?.profile}
                alt=""
                width={100}
                height={100}
              />
            </Link>

             
          </div>
        ) : (
          <div>
            <Button text="Login" class="btn-outline-info" url="/login" />
            &nbsp;
            <Button text="Register" class="btn-info" url="/register" />
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
