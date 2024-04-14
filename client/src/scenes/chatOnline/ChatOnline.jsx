import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    console.log(currentId)
    const getFriends = async () => {
      try{
      const res = await axios.get(
        "http://localhost:8800/api/users/friends/" + currentId
      );
      
      setFriends(res.data);
    }
      catch(err){
        console.log("ERROR:",err)
      }
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends);
  }, [friends, setOnlineFriends]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/conversations/find/${currentId}/${user._id}`
      );

      if (res.data) {
        setCurrentChat(res.data);
      } else {
        // If no conversation is found, create a new one
        const newConversationRes = await axios.post(
          "http://localhost:8800/api/conversations/",
          {
            senderId: currentId,
            receiverId: user._id,
          }
        );
        setCurrentChat(newConversationRes.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "default-profile.jpg"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
