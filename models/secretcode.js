const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SecretcodeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  admincode: { type: String, required: true },
  membercode: { type: String, required: true },
});

// Virtual for user's URL
// UserSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/user/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Secretcode", SecretcodeSchema);

