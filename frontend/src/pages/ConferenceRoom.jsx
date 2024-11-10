import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import Message from "../components/message/Message";
import SendMessage from "../components/message/SendMessage";
import useGetMessages from "../hooks/useGetMessages.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import SelectHostel from "../components/SelectHostel.jsx";

const ConferenceRoom = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const { loading, getMessages } = useGetMessages();
  const { authUser } = useAuthContext();
  const [hostel, setHostel] = useState(authUser.hostel);

  // Fetch messages once on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      if (hostel !== 'All') {
        const data = await getMessages(hostel);
        if (Array.isArray(data)) {
          // Sort messages by timestamp ascending
          const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          setMessages(sortedMessages);
        } else {
          console.error("Data fetched is not an array", data);
        }
      }
    };
    fetchMessages();
  }, [hostel]);

  // Set up socket connections and event listeners
  useEffect(() => {
    if (hostel !== 'All') {
      setIsConnected(socket.connected);

      const onConnect = () => {
        setIsConnected(true);
        socket.emit('joinHostel', hostel);
      };
      const onDisconnect = () => {
        setIsConnected(false);
      };
      const onReceiveMessage = (message) => {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some((msg) => msg.unique_id === message.unique_id);
          if (!messageExists) {
            // Sort messages by timestamp ascending after adding a new message
            const updatedMessages = [...prevMessages, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            return updatedMessages;
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
    }
  }, [hostel]);

  const handleDeleteMessage = async (id) => {
    if (!id) {
      console.error("No unique_id found for message deletion");
      return;
    }
    try {
      socket.emit('deleteMessage', id, hostel);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.unique_id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  function onSelectHostel(hostelValue) {
    setHostel(hostelValue);
    setMessages([]); // Clear messages when changing hostels
  };

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });
  };

  return (
    <div className="flex flex-col items-center">
      {hostel === 'All' ? (
        <SelectHostel onSelectHostel={onSelectHostel} />
      ) : (
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
      )}
    </div>
  );
};

export default ConferenceRoom;
