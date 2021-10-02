import MessageCollection from "../models/messageModel.js";
import UserCollection from "../models/userModel.js";
import ChatCollection from "../models/chatModel.js";

export const createMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Bad request, required fields not there" });
  }
  try {
    let message = await MessageCollection.create({
      content,
      chat: chatId,
      sender: req.userId,
    });
    await ChatCollection.findByIdAndUpdate(chatId,{latestMessage:message});
    message = await UserCollection.populate(message, {
        path: "sender",
        select: "-password",
      });
      message = await ChatCollection.populate(message, {
        path: "chat",
      });
      message = await UserCollection.populate(message, {
        path: "chat.users",
      });
    res.status(201).send({
      data:message,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res
      .status(400)
      .json({ message: "Bad request, required fields not there" });
  }

  try {
    let messages = await MessageCollection.find({
      chat: chatId,
    });

    messages = await UserCollection.populate(messages, {
      path: "sender",
      select: "-password",
    });
    messages = await ChatCollection.populate(messages, {
      path: "chat",
    });
    return res.status(200).send({
      messages,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
