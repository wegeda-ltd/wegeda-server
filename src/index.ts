import mongoose from "mongoose"
import http from 'http';

import { config } from 'dotenv'
import { app } from "./app"
import { Server } from "socket.io"
import axios from "axios";

const server = http.createServer(app);
const io = new Server(server)
config()


const start = async () => {
    console.log("starting up...")
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "wegeda"
        });

        console.log("connected to mongodb");
    } catch (error) {
        console.log(error)
    }
    let port = process.env.PORT || 8081
    server.listen(port, () => {
        console.log("listening on port " + port);
    })
}

const users = new Map();

// TODO MOVE LOGIC TO A SEPARATE FOLDER
// SOCKET
io.use((socket: any, next) => {
    if (socket.handshake.query) {
        let callerId = socket.handshake.query.callerId;
        socket.user = callerId;
        next();
    }
})

io.on("connection", (socket) => {
    console.log("A user connected")
    socket.on("getMessages", async (token) => {

        try {
            const response = await axios.get('http://localhost:3001/api/messages', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })


            const messages = response.data
            io.emit("messages", messages)
        } catch (error: any) {
            // console.log(error, "ERROR")
            // console.log(error?.response?.data, "ERROR MESSAGE")
        }
    })

    socket.on("getSingleChat", async ({ token, message_id }) => {

        try {
            const response = await axios.get('http://localhost:3001/api/messages/' + message_id, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            const messages = response.data
            io.emit("chatMessages", messages)

            return messages
        } catch (error: any) {
            // console.log(error, "ERROR")
            // console.log(error?.response?.data, "ERROR MESSAGE")
        }
    })

    socket.on("sendMessage", async ({ token, data }) => {
        try {
            const resp = await axios.post('http://localhost:3001/api/messages', data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            io.emit("chatMessages", resp.data)
        } catch (error: any) {
            // console.log(error, "ERROR")
            // console.log(error?.response?.data, "ERROR MESSAGE")
        }
    });

    socket.on('join', (userId) => {
        // Store the socket connection using the user ID as a key
        users.set(userId, socket);
        console.log(`User ${userId} joined`);
    });

    socket.on('call-user', ({ from, to, offer }) => {

        // Send a call request to the recipient
        const recipientSocket = users.get(to);
        const callerSocket = users.get(from);

        if (recipientSocket) {
            recipientSocket.emit('call-made', { signal: offer, from });
        }
    });

    socket.on('make-answer', ({ answer, to }) => {
        // Send the answer to the caller
        const callerSocket = users.get(to);

        if (callerSocket) {
            callerSocket.emit('answer-made', { answer });
        }
    });

    socket.on('ice-candidate', ({ candidate, to }) => {

        console.log(candidate, "ICE CANDIDATE OOO")
        // Send ICE candidate to the other user
        const recipientSocket = users.get(to);

        if (recipientSocket) {
            recipientSocket.emit('ice-candidate', { candidate });
        }
    });

    socket.on('disconnect', () => {
        // Remove the socket connection when a user disconnects
        users.forEach((userSocket, userId) => {
            if (userSocket === socket) {
                users.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
});

start()


// socket.on("call", (data) => {
//     let calleeId = data.calleeId;
//     let rtcMessage = data.rtcMessage;

//     socket.to(calleeId).emit("newCall", {
//         callerId: socket.id,
//         rtcMessage: rtcMessage,
//     });
// });

// socket.on("answerCall", (data) => {
//     let callerId = data.callerId;
//     let rtcMessage = data.rtcMessage;

//     socket.to(callerId).emit("callAnswered", {
//         callee: socket.id,
//         rtcMessage: rtcMessage,
//     });
// });

// socket.on("ICEcandidate", (data) => {
//     console.log("ICEcandidate data.calleeId", data.calleeId);
//     let calleeId = data.calleeId;
//     let rtcMessage = data.rtcMessage;
//     console.log("socket.user emit", socket.id);

//     socket.to(calleeId).emit("ICEcandidate", {
//         sender: socket.id,
//         rtcMessage: rtcMessage,
//     });
// });