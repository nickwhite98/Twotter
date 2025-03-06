import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import AvatarManager from "../components/AvatarManager.jsx";
import "../App.css";
import api from "../api.jsx";
import { useParams } from "react-router-dom";

import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button.js";
const apiURL = import.meta.env.VITE_API_URL;

function Account() {
  const { token } = useContext(AuthContext);
  const userID = token.userID;
  const { username } = useParams();
  const { onLogout } = useContext(AuthContext);
  const [avatarFile, setAvatarFile] = useState();

  const [bio, setBio] = useState();

  const handleUpload = async function () {
    console.log(token);
    const formData = new FormData();
    formData.append("file", avatarFile);

    const response = await api.post("/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const getBio = async function () {
    const response = await api.get("/bio");
    setBio(response.data[0].bio);
  };

  useEffect(() => {
    getBio();
  }, []);

  const handleFileChange = function (e) {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <h1>User Page for {username}</h1>
        {bio && <p>{bio}</p>}
        <AvatarManager userID={userID} />
        <MdEdit className="transform scale-150" />
      </div>

      <button type="button" onClick={onLogout}>
        Sign Out
      </button>
      <input id="file" type="file" onChange={handleFileChange}></input>
      {avatarFile && <button onClick={handleUpload}>Upload avatar</button>}
    </>
  );
}

export default Account;
