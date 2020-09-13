import express from 'express';

const app = express();
const PORT = 1000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile('src/public/index.html', { root: __dirname });
  //   res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
