import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import api from "../api.jsx";
const apiURL = import.meta.env.VITE_API_URL;

function AvatarManager(props) {
  const userID = props.userID;
  const [avatarFilePath, setAvatarFilePath] = useState();

  const getAvatar = async function () {
    if (userID) {
      const response = await api.get(`/avatar/${userID}`);
      setAvatarFilePath(response.data[0].avatarPath);
    }
  };

  useEffect(() => {
    getAvatar();
  }, []);
  return (
    <Avatar>
      {avatarFilePath && <AvatarImage src={`${apiURL}${avatarFilePath}`} />}
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
}

export default AvatarManager;
