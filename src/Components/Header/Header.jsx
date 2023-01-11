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
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(authConfig, (user) => {
      if (user) setUser(user);
      else setUser("");
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
        {user.displayName && (
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              className="ProfilePicCont"
              onClick={e=>navigate('/account')}
              style={{ textTransform: "capitalize" }}
            >
              <img
                className="ProfilePic"
                src={
                  user.photoURL
                    ? user.photoURL
                    : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                }
                alt=""
              />
              {user.displayName}
            </div>
            <div style={{ cursor: "pointer" }} onClick={logOutHandler}>
              Logout
            </div>
          </div>
        )}
        {!user.displayName && (
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
