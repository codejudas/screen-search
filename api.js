const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({strict: true}));

/*
 * Add a new movie to the index
 */
app.post('/api/1/movies', (req, res) => {
  console.log(`Adding movie ${req.body.title}`);
  // TODO: check for duplicates?
  res.send({"Hello": "World"});
});

/*
 * Remove a movie from the index
 */
app.delete('/api/1/movies', (req, res) => {
  console.log(`Removing movie ${req.body.id}`);
  res.send({"Goodbye": "World"});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
