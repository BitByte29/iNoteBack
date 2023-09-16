const Express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const App = Express();
App.use(Express.json());
App.use(cors());

const DB = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.iny9g1z.mongodb.net/iNotebook?retryWrites=true&w=majority`;
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("Not connected" + err);
  });

App.get("/", (req, res) => {
  res.send("HI FROM THE SERVER").status(200);
});

App.use("/api/user", require("./routes/userRoutes"));
App.use("/api/notes", require("./routes/notesRoutes"));

const PORT = process.env.PORT || 3001;
App.listen(PORT, () => {
  console.log(`Server listning at port ${PORT}`);
});
