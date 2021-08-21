import ChatCollection from "../models/chatModel.js";
import UserCollection from "../models/userModel.js";

export const createChat = (req, res) => {
  const { users } = req.body;

  if (!users) {
    return res.status(400).json({ message: "Users not provided" });
  }
  if (users.length == 0) {
    return res.status(400).json({ message: "Users not provided" });
  }
  // pushing ourselves into the chat
  users.push(req.userId);

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
};

export const getUsersChat = async (req, res) => {
  try {
    let chats = await ChatCollection.find({
      users: { $elemMatch: { $eq: req.userId } },
    }).populate("users");

    chats = await UserCollection.populate(chats, {
      path: "users",
      select: "-password",
    });

    return res.status(200).send({
      chats,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
