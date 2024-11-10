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
    <div className="flex flex-col items-center justify-between h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="w-full bg-blue-500 text-white py-4 text-center shadow-md">
        <h1 className="text-xl font-semibold">Conference Room</h1>
        <p className="text-sm">
          {isConnected ? "Connected to the room" : "Not connected"}
        </p>
      </div>

      {/* Messages Section */}
      <div className="flex-1 w-full max-w-2xl overflow-y-auto p-4 space-y-4 bg-slate-400 shadow-md rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner"></span>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <Message key={message.unique_id} message={message} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>No messages found.</p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl px-4 py-4 bg-gray-100 border-t shadow-md">
        {isConnected ? (
          <SendMessage />
        ) : (
          <div className="text-center text-red-500">
            <p>Connection error. Please check your internet connection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceRoom;
