import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logsRouter from "./routes/logs.js";
import reportsRouter from "./routes/reports.js";
import cronJob from "./etl/nightJob.js";

 dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api",logsRouter);
app.use("/api",reportsRouter);

app.listen(process.env.PORT,() => {
    console.log(`server running on port: ${process.env.PORT}`);
});
cronJob.start();



