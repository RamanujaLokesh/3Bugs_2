import dotenv from 'dotenv';
dotenv.config();



import pg from 'pg';

const pool = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"users",
    password:"likhith",
    port:5432
    
});

pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Client disconnected');
        process.exit(0);
    });
});

export default pool;
