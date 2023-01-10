import React, { useEffect, useState } from "react";

import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { authConfig } from "../../Firebase/Config";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(authConfig, (user) => {
      if (user) setUserName(user.displayName);
      else setUserName("");
    });
  }, []);

  const logOutHandler = async () => {
    try {
      // loggin out user
      await signOut(authConfig);
    } catch (error) {
      // logout error
      console.log("signout Err =>", error);
    }
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div
          className="brandName"
          onClick={(e) => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <OlxLogo></OlxLogo>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>
        {userName && (
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ textTransform: "capitalize" }}>{userName}</div>
            <div style={{ cursor: "pointer" }} onClick={logOutHandler}>
              Logout
            </div>
          </div>
        )}
        {!userName && (
          <div className="loginPage">
            <Link to="/login">Login</Link>
            <hr />
          </div>
        )}

        <div className="sellMenu" onClick={(_) => navigate("/create")}>
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <span>SELL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
