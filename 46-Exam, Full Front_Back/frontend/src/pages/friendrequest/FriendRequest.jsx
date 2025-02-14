import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";   
import { acceptFriendRequest, sendFriendRequest } from "../../redux/features/friendSlice";



const FriendRequest = ({ friendId }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.friends);
  const [message, setMessage] = useState("");

  const handleSendRequest = async () => {
    const result = await dispatch(sendFriendRequest({ friendId }));
    if (result.payload) setMessage(result.payload.message);
  };

  const handleAcceptRequest = async () => {
    const result = await dispatch(acceptFriendRequest({ friendId }));
    if (result.payload) setMessage(result.payload.message);
  };

  return (
    <div>
      <button onClick={handleSendRequest} disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Friend Request"}
      </button>
      <button onClick={handleAcceptRequest} disabled={status === "loading"}>
        {status === "loading" ? "Accepting..." : "Accept Friend Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default FriendRequest;
