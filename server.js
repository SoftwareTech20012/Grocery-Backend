import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { initApiRoutes } from "./src/api/apiHelper.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

initApiRoutes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server is successfully running on PORT ${process.env.PORT}`);
});