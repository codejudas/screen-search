# Screen Search
Small live-updating movie searching webapp using Algolia, React, and Nodejs.

![live](http://g.recordit.co/NKFG3BVcHp.gif)

## Installation

```bash
$ npm install
```

This will install both the server dependencies as well as client dependencies.

Add environment variables to a `.env` file to configure the server.
```bash
$ echo "ALGOLIA_APP_ID=xxxxxxxxxxxxxxxxxxx" > .env
$ echo "ALGOLIA_API_KEY=yyyyyyyyyyyyyyyyyyyy" >> .env
$ echo "ALGOLIA_SEARCH_API_KEY=zzzzzzzzzzzzzzzzz" >> .env
$ echo "ALGOLIA_INDEX_NAME=movies" >> .env
```

## Running

Run the server:
```bash
$ npm start
```

This starts the express server on port 5000.
