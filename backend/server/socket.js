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
      const { text, hostel_name, sender_regno, timestamp } = msgData; try { await pool.query(`INSERT INTO messages (hostel_name, text, sender_regno, timestamp) VALUES ($1, $2, $3, $4)`, [hostel_name, text, sender_regno, timestamp]); io.to(hostel_name).emit('receiveMessage', msgData); callback({ status: 'ok' }); } catch (error) { callback({ status: 'error' }); }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export default setupSocket;
