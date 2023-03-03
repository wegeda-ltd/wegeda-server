import mongoose from "mongoose"
import { config } from 'dotenv'
import { app } from "./app"


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
    app.listen(port, () => {
        console.log("listening on port " + port);
    })
}

start()