import React, { useState } from 'react';
import { socket } from '../../socket';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SendMessage = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure `value` and `authUser` are defined and available
    if (!value || !authUser) {
      toast.error('Message or user information is missing.');
      setLoading(false);
      return;
    }

    socket.emit('sendMessage', {
      text: value,
      sender_regno: authUser.reg_no,
      hostel_name: authUser.hostel,
      timestamp: new Date().toISOString()
    }, (acknowledgment) => {
      setLoading(false);
      if (acknowledgment.status === 'ok') {
        toast.success('Message sent successfully!');
        setValue('');
      } else {
        toast.error('Failed to send message.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your message"
        disabled={loading}
      />
      <button type='submit' disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

export default SendMessage;
