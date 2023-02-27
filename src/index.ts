import mongoose from "mongoose"
import { config } from 'dotenv'
import { app } from "./app"


config()
const start = async () => {
    console.log("starting up...")

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
    app.listen(process.env.PORT || 8081, () => {
        console.log("listening on port 8081!");
    })
}

start()