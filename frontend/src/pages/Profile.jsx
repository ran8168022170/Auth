import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(file);
  console.log("formdata", formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (filePerc === 100) {
      const timer = setTimeout(() => {
        setFilePerc(0);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [filePerc]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (filePerc == 0) {
          setFilePerc(0);
        }
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundedProgress = Math.round(progress);

        setFilePerc(roundedProgress);

        console.log("upload is " + roundedProgress + "%done");
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
          setFormData({ ...formData, avatar: downloadURl });
        });
      },
    );
  };
  return (
    <div className="mx-auto p-3 max-w-lg ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
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
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button className="uppercase rounded-lg p-3 text-white bg-slate-700 hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600">Delete Account</span>
        <span className="text-red-600">Sign-Out</span>
      </div>
    </div>
  );
}
