// ConferenceRoom.jsx

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
    // ConferenceRoom.jsx

const onReceiveMessage = (message) => {
  setMessages((prevMessages) => {
    // Check if message already exists in the state
    const messageExists = prevMessages.some((msg) => msg.unique_id === message.unique_id);
    if (!messageExists) {
      return [...prevMessages, message];
    }
    return prevMessages;
  });
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
  }, [authUser.hostel]);

  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete message');
      }
  
      // Filter out the deleted message by its unique_id
      setMessages((prevMessages) => {
        console.log("Messages before deletion:", prevMessages);
        const updatedMessages = prevMessages.filter((msg) => msg.unique_id !== id);
        console.log("Messages after deletion:", updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  

  // Function to add a new message to the messages state
  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-center flex-wrap gap-2 w-4/5">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <Message key={message.unique_id} message={message} onDelete={handleDeleteMessage} />
          ))
        ) : (
          <p>No messages found.</p>
        )}
        {isConnected ? (
          <SendMessage addMessage={addMessage} />
        ) : (
          <div>Connection error</div>
        )}
      </div>
    </div>
  );
};

export default ConferenceRoom;
