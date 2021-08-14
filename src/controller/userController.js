import UserCollection from "../models/userModel.js";

export const getUser = async (req, res) => {
  const usernameOrId = req.params.usernameOrId;
  try {
    var user = await UserCollection.findOne({ username: usernameOrId });
    if (user == null) {
      user = await UserCollection.findById(usernameOrId);
      if (user == null) {
        return res.sendStatus(404);
      }
    }
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};
