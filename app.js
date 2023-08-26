const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.render('hello.ejs');
});

app.get('/top', (req, res) => {
  res.render('top.ejs');
});

app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}`);
});
