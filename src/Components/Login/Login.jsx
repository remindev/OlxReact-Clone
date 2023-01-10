import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../olx-logo.png";
import "./Login.css";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { authConfig } from "../../Firebase/Config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    e.preventDefault();
    try {
      // signing in with email and password
      await signInWithEmailAndPassword(authConfig, email, password);

      navigate("/");
    } catch (error) {
      // handling error while loggin in
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
    <div className="loginParentDiv">
      <img width="200px" height="200px" alt="" src={Logo}></img>
      {status.show && (
        <div className={`StatusDisp ${status.isError ? "" : "Good"}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">Email</label>
        <br />
        <input
          className="input"
          type="email"
          id="fname"
          name="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="lname">Password</label>
        <br />
        <input
          className="input"
          type="password"
          id="lname"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button>Login</button>
      </form>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default Login;
