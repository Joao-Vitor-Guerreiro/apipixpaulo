import express from "express";
import { ofertRouter } from "./routes/routes";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(ofertRouter);

app.listen(3434, () => {
  console.log("Server is running on 3434...");
});

export { app };
