import React, { Component } from 'react';
import AlgoliaClient from 'algoliasearch';
import SearchBox from './components/searchBox';
import SearchResults from './components/searchResults';

import './style/app.css';

class App extends Component {
  APP_ID = 'BY41L4QN3A';
  SEARCH_ONLY_API_KEY = 'e63bfd56ed5ae8facc75497aa9928062';
  INDEX_NAME = 'movies';

  state = {
    query: '',
    results: { hits: [] },
  };

  constructor(props) {
    super(props);
    this.client = AlgoliaClient(this.APP_ID, this.SEARCH_ONLY_API_KEY);
    this.moviesIndex = this.client.initIndex(this.INDEX_NAME);
  }

  updateSearchResults(searchQuery) {
    console.log(`Refreshing search results with query ${searchQuery}`);
    this.moviesIndex.search({ query: searchQuery })
        .then(results => {
            console.log(`Got ${results.length} results`);
            console.log(results);
            this.setState({ 
              results: results,
              query: searchQuery,
            });
        });
  }

  onEntryDeleted(movieId) {
    // Search seems to be eventually consistent so refreshing the search results won't remove the item
    // Filter the results list manually to remove it immediately
    let newHits = this.state.results.hits.filter(e => e.objectID !== movieId);
    let newResults = Object.assign({}, this.state.results, {
      hits: newHits, 
      nbHits: this.state.results.nbHits - 1,
    });
    this.setState({ results: newResults });
  }

  render() {
    return (
    <div className="container">
      <SearchBox onQueryChanged={this.updateSearchResults.bind(this)} placeholder="Start typing to discover movies..." />
      <SearchResults results={this.state.results} query={this.state.query} onEntryDeleted={this.onEntryDeleted.bind(this)} />
    </div>
    );
  }
}

export default App;