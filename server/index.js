import connectDB from "./src/databases/index.js";
import app from "./app.js";
import { server } from "./src/socket/index.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error in DB connection:", error);
    process.exit(1); 
  });