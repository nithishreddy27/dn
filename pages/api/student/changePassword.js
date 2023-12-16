import User from "../../../models/User";
import connectDB from "../../../src/lib/connectDB";
import { validatePassword } from "../../../src/lib/user";
import crypto from "crypto";

export default async function handler(req, res) {
  const user = req.body.user;
  var validate = validatePassword(user, req.body.currentPassword);
  if (validate) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(req.body.newPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    await connectDB();
    var done = await User.findOneAndUpdate(
      { _id: user._id },
      { salt: salt, hash: hash },
      {
        new: true,
      }
    );
    res.status(200).send("success");
  } else {
    res.status(500).send({ password: false });
  }
}
