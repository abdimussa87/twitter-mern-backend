import ChatCollection from "../models/chatModel.js";
import UserCollection from "../models/userModel.js";
import MessageCollection from "../models/messageModel.js";
import mongoose from "mongoose";

export const createChat =async (req, res) => {
  const { users } = req.body;

  if (!users) {
    return res.status(400).json({ message: "Users not provided" });
  }
  if (users.length == 0) {
    return res.status(400).json({ message: "Users not provided" });
  }
  // pushing ourselves into the chat
  users.push(req.userId);
  if (users.length == 2) {
    const anotherUserId = users[0]._id;
    let isValidChatUserId = mongoose.isValidObjectId(anotherUserId);
    if (!isValidChatUserId) {
      return res.sendStatus(400);
    }
    try {
      let chat = await ChatCollection.findOne({
        _id: anotherUserId,
        users: { $elemMatch: { $eq: req.userId } },
      });
      if (chat == null) {
        //Check if anotherUserId is a user id
        let userFound = await UserCollection.findById(anotherUserId);
        if (userFound == null) {
          return res
            .status(404)
            .send(
              "Chat doesn't exist or you don't have permission to access it."
            );
        } else {
          // get chat using userId
          chat = await getChatByUserId(req.userId, anotherUserId);
          return res.status(200).send({
            data:chat,
          });
        }
      }
      chat = await UserCollection.populate(chat, {
        path: "users",
        select: "-password",
      });

      return res.status(200).send({
        data:chat,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    ChatCollection.create(
      { users, isGroupChat: users.length > 2 },
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
  }
};

export const getUsersChat = async (req, res) => {
  try {
    let chats = await ChatCollection.find({
      users: { $elemMatch: { $eq: req.userId } },
    }).sort({ updatedAt: -1 });

    chats = await UserCollection.populate(chats, {
      path: "users",
      select: "-password",
    });
    chats = await MessageCollection.populate(chats, {
      path: "latestMessage",
    });
    chats = await UserCollection.populate(chats, {
      path: "latestMessage.sender",
      select: "-password",
    });
    return res.status(200).send({
      chats,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getChat = async (req, res) => {
  const chatId = req.params.id;
  let isValidChatId = mongoose.isValidObjectId(chatId);
  if (!isValidChatId) {
    return res.sendStatus(400);
  }
  try {
    let chat = await ChatCollection.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.userId } },
    });
    if (chat == null) {
      //Check if chatId is a user id
      let userFound = await UserCollection.findById(chatId);
      if (userFound == null) {
        return res
          .status(404)
          .send(
            "Chat doesn't exist or you don't have permission to access it."
          );
      } else {
        // get chat using userId
        chat = await getChatByUserId(req.userId, chatId);
        return res.status(200).send({
          chat,
        });
      }
    }
    chat = await UserCollection.populate(chat, {
      path: "users",
      select: "-password",
    });

    return res.status(200).send({
      chat,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

async function getChatByUserId(userLoggedInId, otherUserId) {
  // trying to find a chat between two users only and if not exists creating one
  let chat = await ChatCollection.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) } },
          { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
        ],
      },
    },
    {
      $setOnInsert: {
        users: [userLoggedInId, otherUserId],
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  chat = await UserCollection.populate(chat, {
    path: "users",
    select: "-password",
  });
  return chat;
}

export const updateChat = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      let updatedChat = await ChatCollection.findByIdAndUpdate(
        id,
        { chatName: req.body.chatName },
        { new: true }
      );
      updatedChat = await UserCollection.populate(updatedChat, {
        path: "users",
        select: "-password",
      });

      res.status(200).json({ chat: updatedChat });
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(400).json({ message: "Chat id required" });
  }
};
