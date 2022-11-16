const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, required: false },
  admin: { type: Boolean, required: false },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

// Virtual for user's String ID
// UserSchema.virtual("stringId").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `${this._id.toHexString()};`;
// });

// Export model
module.exports = mongoose.model("User", UserSchema);

