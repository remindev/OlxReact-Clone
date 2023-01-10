import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import LoginPage from "./Pages/Login";
import CreatePage from "./Pages/Create";
import SignupPage from "./Pages/Signup";
import ViewPost from "./Pages/ViewPost";
import Firebase, { UserDataContext } from "./Context/Firebase";
import { appConfig } from "./Firebase/Config";
import { PostContext } from "./Context/Post";

function App() {
  return (
    <Firebase.Provider value={{ appConfig }}>
      <UserDataContext>
        <PostContext>
          <div className="App">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/view" element={<ViewPost />} />
            </Routes>
          </div>
        </PostContext>
      </UserDataContext>
    </Firebase.Provider>
  );
}

export default App;
