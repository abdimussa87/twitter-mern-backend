import MessageCollection from "../models/messageModel.js";
import UserCollection from "../models/userModel.js";
import mongoose from "mongoose";

export const createMessage = (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Bad request, required fields not there" });
  }

  MessageCollection.create(
    { content, chat: chatId, sender: req.userId },
    (err, data) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send({
          data,
        });
      }
    }
  );
};
