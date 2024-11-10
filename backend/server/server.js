import express from 'express'
import http from 'http'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'


import pool from '../dbConfig.js'
import authRouter from '../router/auth.routes.js'
import dataRouter from '../router/data.router.js'
import userRouter from '../router/user.router.js'
import complaintRoutes from '../router/complaint.router.js';
import messageRouter from '../router/message.router.js'

import setupSocket from './socket.js'

const app  = express();
const server = http.createServer(app);

setupSocket(server);


dotenv.config();


const port  = 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))

app.use("/api/auth" , authRouter);
app.use("/api/data" , dataRouter )
app.use('/api/user',userRouter);
app.use('/api/message', messageRouter);
app.use('/api/complaints', complaintRoutes);

app.get('/' , async(req,res)=>{
    const result = await pool.query("SELECT * FROM student_details ;");
       const  items = result.rows;
        console.log(items)
    res.send("../frontend/login.html")
})

server.listen(port, () => {
    console.log(`sever running on port ${port}`);
})