const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  editdate: {
    type: Date,
  },
});

// Indexes
noteSchema.index({ user: 1 }); // Single-field index on 'user' for user-specific queries
noteSchema.index({ title: "text", description: "text" }); // Text indexes for full-text search

const Notes = mongoose.model("notes", noteSchema);

module.exports = Notes;
