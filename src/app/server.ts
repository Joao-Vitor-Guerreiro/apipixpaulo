import express from "express";
import { router } from "./routes/routes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(router);

app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

app.listen(3434, () => {
  console.log("Server is running on 3333...");
});

export { app };
