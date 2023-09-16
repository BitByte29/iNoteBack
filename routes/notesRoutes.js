const Express = require("express");
const Router = Express.Router();
const notesController = require("./../controllers/notesController");
const fetchUser = require("./../middleware/fetchuser");
const { body } = require("express-validator");

//Fetch notes of a perticular user
Router.route("/fetchallnotes").get(fetchUser, notesController.fetchAllNotes);

Router.route("/addnote").post(
  fetchUser,
  [
    body("title", "Enter a valid title min length 3 characters.").isLength({
      min: 3,
    }),
    body("description", "Description must be at least 5 characters.").isLength({
      min: 5,
    }),
  ],
  notesController.addNote
);

Router.route("/updatenote/:id").put(
  fetchUser,
  [
    body("title", "Enter a valid title min length 3 characters.").isLength({
      min: 3,
    }),
    body("description", "Description must be at least 5 characters.").isLength({
      min: 5,
    }),
  ],
  notesController.updateNote
);
Router.route("/deletenote/:id").delete(fetchUser, notesController.deleteNote);

module.exports = Router;
