import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  updateAvatar,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(`current user 1: ${currentUser?.avatar}`);
  // useEffect(() => {
  //   if (file) {
  //     handleFileUpload(file);
  //   }
  // }, [file]);

  useEffect(() => {
    if (updateSuccess === true) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern_auth");
    data.append("cloud_name", "dixz7bt9u");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dixz7bt9u/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    console.log("hello");

    const urlSource = await res.json();
    setFormData({ ...formData, avatar: urlSource.url });
    dispatch(updateAvatar(urlSource.url));
    console.log("urlSource", urlSource.url);
    console.log("currentuseravatar 2", currentUser.avatar);
  };

  // const handleFileUpload = (file) => {
  //   console.log("hello");
  //   console.log(file);

  //   // const storage = getStorage(app);
  //   // const fileName = new Date().getTime() + file.name;
  //   // const storageRef = ref(storage, fileName);
  //   // const uploadTask = uploadBytesResumable(storageRef, file);

  //   // uploadTask.on(
  //   //   "state_changed",
  //   //   (snapshot) => {
  //   //     if (filePerc == 0) {
  //   //       setFilePerc(0);
  //   //     }
  //   //     const progress =
  //   //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //   //     const roundedProgress = Math.round(progress);

  //   //     setFilePerc(roundedProgress);

  //   //     console.log("upload is " + roundedProgress + "%done");
  //   //   },
  //   //   (error) => {
  //   //     console.log(error);
  //   //     setFileUploadError(true);
  //   //   },
  //   //   () => {
  //   //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
  //   //       setFormData({ ...formData, avatar: downloadURl });
  //   //     });
  //   //   },
  //   // );
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      signOutUserStart();
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="mx-auto p-3 max-w-lg ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          onChange={handleFileUpload}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className=" rounded-full h-24 w-24 object-cover mx-auto"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-600">Image {filePerc}% Uploaded</span>
          ) : filePerc == 100 ? (
            <span className="text-green-700">Image successfully Uploaded </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="uppercase rounded-lg p-3 text-white bg-slate-700 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 p-3 ronded uppercase text-center hover:opacity-95 text-white"
          to={"/create-listing"}
        >
          create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-600">
          Delete Account
        </span>
        <span onClick={handleSignOutUser} className="text-red-600">
          Sign-Out
        </span>
      </div>
      <p className="mt-5 text-red-700">{error ? error : ""}</p>
      <p className="mt-5 text-green-700">
        {updateSuccess ? "user updated successfully " : ""}
      </p>
    </div>
  );
}
