import React, { useEffect, useContext, useState } from "react";
import { PostContextOrgin } from "../../Context/Post";
import { getDoc, doc } from "firebase/firestore";

import "./View.css";
import { firestoreConfig } from "../../Firebase/Config";
function View() {
  const { post } = useContext(PostContextOrgin);
  const [user, setUser] = useState({
    userName: "OLX User",
    phone: "000 000 0000",
  });

  useEffect(() => {
    // inner funcion is to use async
    const innerFunction = async () => {
      try {
        const docRef = doc(firestoreConfig, "users", post?.uid);
        const docData = await getDoc(docRef);
        setUser(docData.data());
      } catch (error) {
        // error while fetching user data
        console.error(error);
      }
    };
    innerFunction();
  }, []);

  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img src={post.img} alt="" />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {post.price} </p>
          <span>{post.name}</span>
          <p>{post.category}</p>
          <span>{post.date}</span>
        </div>
        <div className="contactDetails">
          <p>Seller details</p>
          <p style={{ textTransform: "capitalize" }}>{user.userName}</p>
          <p>{user.phone}</p>
        </div>
      </div>
    </div>
  );
}
export default View;
