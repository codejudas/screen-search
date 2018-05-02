require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const algolia = require('algoliasearch');

const APP_ID = process.env.ALGOLIA_APP_ID;
const API_KEY = process.env.ALGOLIA_API_KEY;
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

if (!API_KEY || !API_KEY || !INDEX_NAME) { 
  throw new Error("Environment variables missing, see README.md"); 
}

const algoliaClient = algolia(APP_ID, API_KEY);
const moviesIndex = algoliaClient.initIndex(INDEX_NAME);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({strict: true}));

/*
 * Add a new movie to the index
 */
app.post('/api/1/movies', (req, res) => {
  console.log(`Adding movie ${req.body.title}`);
  moviesIndex.addObjects([req.body], (err, content) => {
    if (err) throw err;

    let taskId = content.taskID;
    let objId = content.objectIDs[0];
    console.log(`Created with obj id: ${objId}`);
    console.log(`Waiting for task ${taskId}`);
    moviesIndex.waitTask(taskId, (err, content) => {
      if (err) throw err;

      console.log(content);
      console.log(`Successfully added movie ${req.body.title}`);
      let movieData = Object.assign({objectID: objId}, req.body);
      res.status(201).send(req.body);
    });
  });
});

/*
 * Remove a movie from the index
 */
app.delete('/api/1/movies/:id', (req, res) => {
  console.log(`Removing movie ${req.params.id}`);
  moviesIndex.deleteObjects([req.params.id], (err, content) => {
    if (err) throw err;
    let taskId = content.taskID;
    console.log(`Waiting for task ${taskId}`);
    moviesIndex.waitTask(taskId, (err, content) => {
      if (err) throw err;

      console.log(content);
      console.log(`Successfully removed movie ${req.params.id}`);
      res.status(204).send();
    });
  });
 //res.status(204).send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Algolia app id: ${APP_ID} index: ${INDEX_NAME}`);
});
