import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import "../App.css";
import api from "../api.jsx";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button.js";
const apiURL = import.meta.env.VITE_API_URL;

function Account() {
  const { token } = useContext(AuthContext);
  const { username } = useParams();
  const { onLogout } = useContext(AuthContext);

  const [avatarFile, setAvatarFile] = useState();
  const [avatarFilePath, setAvatarFilePath] = useState();

  const handleUpload = async function () {
    console.log(avatarFile);
    const formData = new FormData();
    formData.append("file", avatarFile);

    const response = await api.post("/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setAvatarFilePath(response.data.filePath);
  };

  const getAvatar = async function () {
    const response = await api.get("/avatar");
    setAvatarFilePath(response.data[0].avatarPath);
  };

  useEffect(() => {
    getAvatar();
  }, []);

  const handleFileChange = function (e) {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar>
          {avatarFilePath && <AvatarImage src={`${apiURL}${avatarFilePath}`} />}
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <h1>User Page for {username}</h1>

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
