const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        text: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      },
    ],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("content", contentSchema);
