import UserCollection from "../models/userModel.js";
import PostCollection from "../models/postModel.js";

export const getUser = async (req, res) => {
  const usernameOrId = req.params.usernameOrId;
  const hasReply = req.query.hasReply =="true";
  try {
    var user = await UserCollection.findOne({ username: usernameOrId });
    if (user == null) {
      user = await UserCollection.findById(usernameOrId);
      if (user == null) {
        return res.sendStatus(404);
      }
    }
    let postsFromDb = await PostCollection.find({postedBy:user._id,replyTo:{$exists:hasReply}})
      .populate({
        path: "postedBy",
        select: "profilePic firstName lastName username _id",
      })
      .populate("retweetData")
      .populate("replyTo")
      .sort({ createdAt: -1 });
    postsFromDb = await UserCollection.populate(postsFromDb, {
      path: "retweetData.postedBy",
      select: "profilePic firstName lastName username _id",
    });
    postsFromDb = await UserCollection.populate(postsFromDb, {
      path: "replyTo.postedBy",
      select: "profilePic firstName lastName username _id",
    });
    res.status(200).json({ user: user,posts:postsFromDb });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};
