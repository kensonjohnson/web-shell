import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import asyncHandler from "express-async-handler";
import { chdir } from "node:process";

// Import controllers
import { helloController } from "./controllers/root-controller.js";
import { runCommandController } from "./controllers/run-controller.js";

// Setup express
const app = express();
const port = 3000;

// Dev specific configuration
if (process.env.NODE_ENV === "dev") {
  chdir("build");
}

// Configure middleware
app.use(cors());
app.use(express.static("frontend")); // Bring in the built client
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/hello", helloController);

app.post("/run", runCommandController);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/`);
});
