import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();

  // console.log(message, "in each message");
  const reg_no = message.sender_regno; // Use sender_regno from message object
  const isSender = authUser.reg_no === reg_no;

  return (
    <div className={"chat " + (isSender ? "chat-end" : "chat-start")}>
      <div className="chat-header">
        {reg_no}
        <time className="text-xs opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</time>
      </div>
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
};

export default Message;
