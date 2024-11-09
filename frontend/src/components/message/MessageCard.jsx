import React from 'react'

const MessageCard = ({reg_no , isSender}) => {
  return (
    <>
    <div className={"chat" + isSender?"chat-start":"chat-end"}>
  <div className="chat-header">
    reg_no
    <time className="text-xs opacity-50">2 hours ago</time>
  </div>
  <div className="chat-bubble">You were the Chosen One!</div>
</div>
    </>
  )
}

export default MessageCard