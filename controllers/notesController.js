const Notes = require("./../models/noteModel");
const { validationResult, body } = require("express-validator");

//Fetch ALL notes
exports.fetchAllNotes = async (req, res) => {
  try {
    let notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//Add notes
exports.addNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors
        .array()
        .map((error) => error.msg)
        .join(" "),
    });
  }
  try {
    const { title, description, tag } = req.body;
    let note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();
    res.status(201).json({
      message: "Note added successfully",
      data: note,
    });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//Update notes
exports.updateNote = async (req, res) => {
  let { title, description, tag, editdate } = req.body;
  let newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;
  if (editdate) newNote.editdate = editdate;

  let note = await Notes.findById(req.params.id);
  if (!note) {
    req.status(404).json({ message: "Note not found" });
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not allowed" });
  }
  try {
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ message: "Note updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//Delete notes
exports.deleteNote = async (req, res) => {
  let note = await Notes.findById(req.params.id);
  if (!note) {
    res.status(404).json({ message: "Note not found" });
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not Allowed" });
  }
  try {
    note = await Notes.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Note added successfully",
      data: note,
    });
  } catch {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
