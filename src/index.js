import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";

// *Useful for getting environment vairables
dotenv.config();

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send("Hi there");
});

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

app.use(
  "/public/profileImages",
  express.static(path.join("./src", "uploads/profilePictures"))
);

// *Database connection
mongoose
  .connect("mongodb+srv://my_user:N4zL2NGS32LLbus@cluster0.gmjca.mongodb.net/twitter-clone?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((value) => console.log("Connected to db"));

const server = createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
server.listen("8080", () => {
  console.log("Listening on port 8080");
});

io.on("connection", (socket) => {
  console.log("Connected to socket io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });
  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
  });

  socket.on("stopTyping", (chatId) => {
    socket.in(chatId).emit("stopTyping");
  });
  socket.on("newMessage", (newMessage) => {
      let chat = newMessage.chat;
      if(!chat.users) return console.log('Chat.users not defined');
      chat.users.forEach(user=>{
          if(user._id == newMessage.sender._id) return;
          socket.in(user._id).emit("newMessage",newMessage);
      })
  });
});
