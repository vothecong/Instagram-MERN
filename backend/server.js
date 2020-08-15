require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 4000;
const db = require("./configs/KEYS").URI;

mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("connect feild!!", err);
    } else {
      console.log("connect success!!");
    }
  }
);

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

/*
const flash = require("connect-flash");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const keyS = require("./configs/KEYS").KEY_SECRET;
app.use(flash());
let MongoStore = connectMongo(session);
let sessionStore = new MongoStore({
  url: db,
  autoReconnect: true,
  autoRemove: "native",
});
app.use(
  session({
    key: keyS,
    secret: keyS,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
*/
const { user, content } = require("./routes/index");

app.use("/users", user);
app.use("/contents", content);

app.use("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server run build!!!",
  });
});

app.use((req, res, next) => {
  const error = new Error("Not found!!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server run with PORT = ${port}`);
});

/**
 *  res.json({
    error: {
      message: error.message,
    },
  });
 */
