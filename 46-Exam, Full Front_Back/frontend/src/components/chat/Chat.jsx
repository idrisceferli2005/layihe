import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import { io } from "socket.io-client";

const Chat = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("http://localhost:5000", { withCredentials: true });

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.disconnect();  // Component unmount olduqda əlaqəni kəsirik
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("sendMessage", newMessage); // Mesaj göndəririk
      setNewMessage(""); // Mesaj göndərildikdən sonra inputu təmizləyirik
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="messageContainer">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" color="primary">
            Send
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
};

export default Chat;
