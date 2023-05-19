const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const users = require("./routes/users");

// setting up an Express application
const app = express();

// Middleware

app.use(bodyParser.urlencoded({ extended: false }));
// requests that have data in the form of a JSON object in the request body.
//  This middleware parses the JSON data and makes it available in req.body.
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
  // any origin is allowed to access the resource.
  res.header("Access-Control-Allow-Origin", "*");
  // HTTP methods that are allowed to access the resource
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  // the request headers that are allowed when making a cross-origin request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Route Middleware
app.use("/api/users", users);

const db =
  "mongodb+srv://Aarushi:archit256@cluster0.pjb8r.mongodb.net/userlist?retryWrites=true&w=majority";
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("MongoDB connected"))
  .catch((err) => console.log(err)); // Maybe return res code 500

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  const host = server.address().address;
  // const port = server.address().port;
  console.log(`server runs on host ${host}, port ${PORT}`);
});
