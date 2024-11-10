import pool from '../dbConfig.js';
import { Server } from 'socket.io';

// Function to initialize Socket.IO
function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinHostel', (hostel) => {
      socket.join(hostel);
      console.log(`User joined in ${hostel}`);
    });

    // Handle chat messages
    socket.on('sendMessage', async (msgData, callback) => {
      const { text, hostel_name, sender_regno, timestamp } = msgData;
      try {
        const result = await pool.query(
          `INSERT INTO messages (hostel_name, text, sender_regno, timestamp) VALUES ($1, $2, $3, $4) RETURNING unique_id`,
          [hostel_name, text, sender_regno, timestamp]
        );
        const newMessage = { ...msgData, unique_id: result.rows[0].unique_id };
        
        io.to(hostel_name).emit('receiveMessage', newMessage);
        callback({ status: 'ok', message: newMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        callback({ status: 'error' });
      }
    });
    
    socket.on('deleteMessage', async (messageId) => {
      await pool.query(`DELETE FROM messages WHERE unique_id = $1`, [messageId]);
      io.to(hostel).emit('messageDeleted', messageId);
    });
    

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export default setupSocket;
