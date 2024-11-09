import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import Message from "../components/message/Message";
import SendMessage from "../components/message/SendMessage";
import useGetMessages from "../hooks/useGetMessages.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const ConferenceRoom = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const { loading, getMessages } = useGetMessages();
  const { authUser } = useAuthContext();

  // Fetch messages once on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Data fetched is not an array", data);
      }
    };
    fetchMessages();
  }, []);

  // Set up socket connections and event listeners
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('joinHostel', authUser.hostel);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };
    const onReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessage", onReceiveMessage);

    // Clean up socket connections on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.unique_id} message={message} />
        ))
      ) : (
        <p>No messages found.</p>
      )}
      {isConnected ? (
        <SendMessage />
      ) : (
        <div>Connection error</div>
      )}
    </div>
  );
};

export default ConferenceRoom;
