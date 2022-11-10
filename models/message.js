const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

// Virtual for message's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);

