import React, { Fragment, useState } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import {
  authConfig,
  firestoreConfig,
  storageConfig,
} from "../../Firebase/Config";
import { onAuthStateChanged } from "firebase/auth";

const Create = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState("");
  const [showUpload, setShowUpload] = useState({
    show: false,
    message: "Uploading",
    error: false,
  });
  const [showStatus, setShowStatus] = useState({
    show: false,
    error: false,
    message: "-",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // referance
    if (
      name.trim().length === 0 ||
      category.trim().length === 0 ||
      price.trim().length === 0 ||
      file.length === 0
    ) {
      // not able to upload...
      setShowStatus({
        message: "plz fill all the required fields",
        error: true,
        show: true,
      });
      return false;
    }

    const storageRef = ref(storageConfig, `Products/${file.name}`);

    // starts uploading...
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setShowUpload({
          ...showUpload,
          message: "Uploading Image " + Math.floor(progress) + "% ",
          show: true,
        });
      },
      (error) => {
        // Handle unsuccessful uploads
        console.warn(error);
        setShowUpload({
          ...showUpload,
          error: true,
          message: "Faild to upload image",
          show: true,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // after completeing image uploading, upload data to firestore

          setShowUpload({
            ...showUpload,
            message: "Uploading data...",
            show: true,
          });

          onAuthStateChanged(authConfig, async (user) => {
            await addDoc(collection(firestoreConfig, "products"), {
              name: name.trim(),
              category: category.trim(),
              price: price.trim(),
              img: downloadURL,
              uid: user.uid,
              date: new Date().toDateString(),
            });

            setShowStatus({
              message: "Upload completed",
              error: false,
              show: true,
            });
            setShowUpload({
              show: false,
            });
            setName("");
            setCategory("");
            setFile("");
            setPrice("");

            // console.log(downloadURL);
          });
        });
      }
    );
  };

  return (
    <Fragment>
      <Header />
      <div>{showUpload.message}</div>
      <div>
        <div className="centerDiv">
          {showUpload.show && <div>{showUpload.message}</div>}
          {!showUpload.show && (
            <div>
              {showStatus.show && (
                <div className={`StatusDisp ${showStatus.error ? "" : "Good"}`}>
                  {showStatus.message}
                </div>
              )}
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="Name">Name</label>
                <br />
                <input
                  className="input"
                  type="text"
                  name="Name"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <br />
                <label htmlFor="category">Category</label>
                <br />
                <input
                  className="input"
                  type="text"
                  name="category"
                  value={category}
                  placeholder="Category"
                  onChange={(e) => setCategory(e.target.value)}
                />
                <br />
                <label htmlFor="Price">Price</label>
                <br />
                <input
                  className="input"
                  type="number"
                  name="Price"
                  value={price}
                  placeholder="Price"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <br />
              </form>
              <br />
              <img
                alt="Posts"
                width="200px"
                height="200px"
                style={{ objectFit: "scale-down" }}
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
                }
              ></img>
              <form onSubmit={(e) => handleSubmit(e)}>
                <br />
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  className="input"
                />
                <br />
                <button className="uploadBtn">upload and Submit</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Create;
