import express from "express";
import session from "express-session";
const app = express();
// const port = 3000;

import routes from "./routes/index.js";

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(
  session({
    secret: 'itsy_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000);
