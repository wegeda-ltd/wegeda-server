import mongoose from "mongoose"
import http from 'http';
import express from 'express';
import { config } from 'dotenv'
import { app } from "./app"
import { Server, Socket } from "socket.io"
import axios from "axios";
import { User } from "./models";
import { UserType } from "./types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const server = http.createServer(app);
const io = new Server(server)
config()

declare global {
    namespace Express {
        interface Request {
            io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
            socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
        }
    }
}

let port = process.env.PORT || 8081


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
    server.listen(port, () => {
        console.log(port, "PORT OO")
        console.log("listening on port " + port);
    })
}

// const users = new Map();

// TODO MOVE LOGIC TO A SEPARATE FOLDER
// SOCKET
io.use((socket: any, next) => {
    if (socket.handshake.query) {
        let user = socket.handshake.query.user_id;

        socket.user = user;
        next();
    }
})

express.request.io = io;
const baseUrl = 'https://wegeda-server.pipeops.app'
io.on("connection", async (socket) => {
    // @ts-ignore
    express.request.socket = socket
    const sock: any = socket
    let user: any = {};
    if (sock.user !== "undefined") {
        console.log(sock.user, "A user connected")

        user = await User.findById(sock.user)
        if (user?.id) {
            user.set({
                status: "online"
            })

            await user.save()

        }

    }
    socket.on("getMessages", async (token) => {

        try {
            const response = await axios.get(`${baseUrl}/api/messages`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })


            const messages = response.data


            io.emit("messages", messages)
        } catch (error: any) {
            console.log(error, "ERROR")
            console.log(error.response, "ERROR");

        }
    })

    socket.on("getSingleChat", async ({ token, message_id, user_id }) => {

        if (token) {

            try {
                // const subResponse = await axios.get('http://127.0.0.1:5100/api/subscriptions/user-subscription', {
                //     headers: {
                //         Authorization: 'Bearer ' + token
                //     }
                // })

                // const subscription = subResponse.data
                // if (subscription.account_type == UserType.HouseSeeker && (!subscription.user_subscription || subscription.user_subscription.amount_left < 1 || subscription.is_expired)) {
                //     io.emit("no-subscription", { message: "User has no active subscription" })
                //     return;
                // }
                const response = await axios.get(`${baseUrl}/api/messages/${message_id}/${user_id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })

                const messages = response.data
                io.emit("chats", messages)

                return messages
            } catch (error: any) {
                // console.log(error?.response, "ERROR OCURRED")
            }
        }
    })

    socket.on("sendMessage", async ({ token, data }) => {
        try {
            const resp = await axios.post(`${baseUrl}/api/messages`, data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            io.emit("chats", resp.data)
        } catch (error: any) {
            // console.log(error, "ERROR")
            console.log(error?.response?.data, "ERROR MESSAGE")
        }
    });

    socket.on("editMessage", async ({ token, data }) => {
        console.log("HERE OOOO");

        try {
            const resp = await axios.patch(`${baseUrl}/api/messages/${data.id}`, data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            io.emit("chats", resp.data)
        } catch (error: any) {
            console.log(error?.response?.data, "ERROR MESSAGE")

        }
    })


    socket.on("deleteMessage", async ({ token, data }) => {

        try {
            const resp = await axios.delete(`${baseUrl}/api/messages/${data.id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            io.emit("chats", resp.data)
        } catch (error: any) {
            console.log(error?.response?.data, "ERROR MESSAGE")

        }
    })


    socket.on("startCall", async ({ user_id, type, group }) => {
        const sock: any = socket
        // console.log(group, "GROUP")
        const user = await User.findById(sock.user)

        io.emit("incomingCall", { user, group, type, to: user_id })
        // socket.to()
    })
    socket.on("callRejected", ({ receiver, caller }) => {
        io.emit("callRejected", { receiver, caller })
    })
    socket.on("callEnded", ({ receiver, caller }) => {
        io.emit("callRejected", { receiver, caller })
    })
    socket.on("callAccepted", ({ receiver, caller, group }) => {
        console.log("CALL ACCEPTED", receiver, caller, group)
        io.emit("callAccepted", { receiver, caller, group })
    })

    socket.on('disconnect', async () => {

        if (user?.id) {
            user.set({
                status: "offline"
            })

            await user.save()
        }
        // Remove the socket connection when a user disconnects
        // users.forEach((userSocket, userId) => {
        //     if (userSocket === socket) {
        //         users.delete(userId);
        //         console.log(`User ${userId} disconnected`);
        //     }
        // });
        console.log("User disconnected")
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