import express, { request, response } from "express"
import morgan from "morgan";
import cors from 'cors';
import unknownEndpoint from "./middlewares/unkownEndpoint.js";
import personRouter from "./routes/personRouter.js";
import userRouter from "./routes/userRouter.js";
import connectToDB from "./utils/connectToDB.js";
import errorHandler from "./middlewares/errorHandler.js";
import config from "./utils/config.js"


const MONGODB_URI = config.MONGODB_URI;

const app = express();

connectToDB(MONGODB_URI);

morgan.token('body', function (request, response) { return  JSON.stringify(request.body)})


app.use(cors())
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan(':method :url :status :body'));

app.use("/users", userRouter)
app.use('/persons', personRouter);


app.use(unknownEndpoint);
app.use(errorHandler);


export default app