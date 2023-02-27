import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';


import cookieSession from 'cookie-session';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';


const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,

}));

app.get("/", (req, res) => {

    res.send({ message: "I am working fine!" })
})
app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }
