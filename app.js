import express, { request, response } from "express"
import morgan from "morgan";
import cors from 'cors';
import bodyParser from "body-parser";
import mognoSanitize from 'express-mongo-sanitize'
import unknownEndpoint from "./middlewares/unkownEndpoint.js";
import config from "./utils/config.js"
import connectToDB from "./utils/connectToDB.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import dotenv from "dotenv";


const MONGODB_URI = config.MONGODB_URI;
connectToDB(MONGODB_URI);

const app = express();

dotenv.config();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(mognoSanitize());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true}))
app.use(express.static("dist"));
app.use(morgan("dev"));

app.use(router);

//error middleware



app.use(unknownEndpoint);
app.use(errorHandler);


export default app