import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Heart from "../../assets/Heart";
import { PostContextOrgin } from "../../Context/Post";
import { firestoreConfig } from "../../Firebase/Config";
import "./Post.css";

function Posts() {
  const [products, setProducts] = useState([]);
  const { setPost } = useContext(PostContextOrgin);
  const navigate = useNavigate();

  useEffect(() => {
    // writing nested function to use async
    const innerFunction = async () => {
      try {
        // gets data form server
        const prodctsRef = collection(firestoreConfig, "products");
        const productsSnap = await getDocs(prodctsRef);
        const data = productsSnap.docs.map((e) => e.data());

        setProducts(data);
      } catch (error) {
        // error while fetching product data from server
      }
    };
    innerFunction();
  }, []);

  const handleViewPageClick = (product) => {
    setPost(product);
    navigate("/view");
  };

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map((product) => {
            return (
              <div className="cardItem">
                <div className="favorite">
                  <Heart></Heart>
                </div>
                <div
                  className="image"
                  onClick={() => handleViewPageClick(product)}
                >
                  <img src={product.img} alt="" />
                </div>
                <div className="content">
                  <p className="rate">&#x20B9; {product.price}</p>
                  <span className="kilometer">{product.name}</span>
                  <p className="name"> {product.category}</p>
                </div>
                <div className="date">
                  <span>{product.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
        </div>
        <div className="cards">
          <div className="card">
            <div className="favorite">
              <Heart></Heart>
            </div>
            <div className="image">
              <img src="../../../Images/R15V3.jpg" alt="" />
            </div>
            <div className="content">
              <p className="rate">&#x20B9; 250000</p>
              <span className="kilometer">Two Wheeler</span>
              <p className="name"> YAMAHA R15V3</p>
            </div>
            <div className="date">
              <span>10/5/2021</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Posts;
