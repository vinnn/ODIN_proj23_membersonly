const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SecretcodeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  admincode: { type: String, required: true },
  membercode: { type: String, required: true },
});

// Export model
module.exports = mongoose.model("Secretcode", SecretcodeSchema);

