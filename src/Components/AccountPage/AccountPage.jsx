import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  authConfig,
  firestoreConfig,
  storageConfig,
} from "../../Firebase/Config";
import "./AccountPage.css";

function AccountPage() {
  const [user, setUser] = useState({});
  const [imgFile, setImgFIle] = useState(null);
  const [statusDisp, setStatusDisp] = useState({
    show: false,
    message: "-",
    error: false,
  });

  useEffect(() => {
    // getting value from auth state
    onAuthStateChanged(authConfig, async (user) => {
      // getting user data from firestore
      const docSnap = await getDoc(doc(firestoreConfig, "users", user.uid));

      // setting user data to state
      setUser({ ...user, ...docSnap.data() });
    });
  }, []);

  const updateChanges = async () => {
    // check if user data if fetched
    if (!user) return;

    setStatusDisp({ message: "Uploading data", show: true, error: false });

    // upload new profile image
    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        setStatusDisp({
          message: "Uploading Profile picture",
          show: true,
          error: false,
        });

        const storageRef = ref(
          storageConfig,
          `users/${user.uid}/pp.${
            imgFile.name.split(".")[imgFile.name.split(".").length - 1]
          }`
        );

        const uploadTask = uploadBytesResumable(storageRef, imgFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setStatusDisp({
              message: `Uploading Profile picture ${Math.floor(progress)}%`,
              show: true,
              error: false,
            });
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                // after completeing image uploading, upload data to firestore
                resolve(downloadURL);
              }
            );
          }
        );
      });
    };

    let imgUrl = null;

    if (imgFile)
      try {
        imgUrl = await uploadImage();
        setStatusDisp({
          message: "Profile picture uploaded",
          show: true,
          error: false,
        });
      } catch (error) {
        setStatusDisp({
          message: "Error uploading profile picure",
          show: true,
          error: true,
        });
        // faild to upload image
      }

    const data = {
      userName: user.userName,
      phone: user.phone,
    };

    if (imgUrl) data.img = imgUrl;

    setStatusDisp({ message: "Updating data...", show: true, error: false });
    await setDoc(doc(firestoreConfig, `users/${user.uid}`), data, {
      merge: true,
    });

    let dataForProfile = {
      displayName: user.userName,
    };
    if (imgUrl) dataForProfile.photoURL = imgUrl;

    setStatusDisp({ message: "Syncing new data", show: true, error: false });
    await updateProfile(authConfig.currentUser, dataForProfile);

    setStatusDisp({
      message: "Profile updated successfully",
      show: true,
      error: false,
    });
  };

  return (
    <div className="AccountPage">
      <div className="profileContainer">
        <img
          src={
            imgFile
              ? URL.createObjectURL(imgFile)
              : user?.img
              ? user?.img
              : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
          }
          alt=""
        />
        <div
          className="hoverBtn"
          onClick={(e) => e.target.parentElement.querySelector("input").click()}
        >
          Click to update image
        </div>
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files) setImgFIle(e.target.files[0]);
          }}
        />
      </div>
      <div className="userDatas mt-3">
        <div className="userName">{`User name : ${
          user.displayName ? user.displayName : ""
        }`}</div>
        <div className="">{`${user.email ? user.email : ""}`}</div>
        {statusDisp.show && (
          <div className={`StatusDisp mt-3 ${statusDisp.error ? "" : "Good"}`}>
            {statusDisp.message}
          </div>
        )}
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={user.userName ? user.userName : ""}
            className="form-control"
            placeholder="Name"
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
          />
        </div>
        <div className="input-group mt-3">
          <label htmlFor="phone">Phone</label>
          <input
            type="phone"
            value={user.phone ? user.phone : ""}
            className="form-control"
            placeholder="phone"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
      </div>
      <button className="mt-5 btn btn-dark" onClick={() => updateChanges()}>
        Update Changes
      </button>
    </div>
  );
}

export default AccountPage;
