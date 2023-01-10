const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  userId: { type: String, required: false },
  name: { type: String, required: true },
  age: { type: Number, required: false },
  phoneOtp: { type: String, required: false },
  isAccountVerified: { type: Boolean, required: false },
  mobile: { type: Number, required: true },
  email: { type: String },
  usersInContact: [{ type: String, required: false}],
  profilePicUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("user", UserSchema, "user");
