import "./Signup.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../olx-logo.png";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { authConfig, firestoreConfig } from "../../Firebase/Config";
import { useEffect } from "react";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState({
    isError: false,
    message: "-",
    show: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(authConfig, (user) => {
      if (user) {
        navigate("/");
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    // prevents default behaviour of form
    e.preventDefault();

    try {
      // createing user in firebase
      const result = await createUserWithEmailAndPassword(
        authConfig,
        email.trim(),
        password.trim()
      );

      // updating userName to user object
      await updateProfile(authConfig.currentUser, {
        displayName: userName,
      });

      // saving additional user data to firestore
      await setDoc(doc(firestoreConfig, "users", result.user.uid), {
        userName: userName,
        phone: phone,
      });

      navigate("/");

      //...
    } catch (error) {
      // handleing error while creating user
      setStatus({
        isError: true,
        message:
          error?.code?.split("/")?.[1]?.split("-")?.join(" ") ??
          "An Error occured",
        show: true,
      });
    }
  };

  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" alt="" src={Logo}></img>
        {status.show && (
          <div className={`StatusDisp ${status.isError ? "" : "Good"}`}>
            {status.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            type="text"
            name="name"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            name="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button>Signup</button>
        </form>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
