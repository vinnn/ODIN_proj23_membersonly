const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true },
  time: { type: Date, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

// Virtual for message's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/message/${this._id}`;
});

// Virtual for message's datetime formatted for display
MessageSchema.virtual("time_formatted").get(function () {
  // const newFormat = {...DateTime.TIME_SIMPLE, month: 'long', day: 'numeric'}
  const newFormat = {...DateTime.TIME_SIMPLE}
  return DateTime.fromJSDate(this.time).toLocaleString(newFormat);
});

// Virtual for message's date
MessageSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);

