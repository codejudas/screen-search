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
    totalHits: 0,
    hits: [],
    results: null,
  };

  constructor(props) {
    super(props);
    this.client = AlgoliaClient(this.APP_ID, this.SEARCH_ONLY_API_KEY);
    this.moviesIndex = this.client.initIndex(this.INDEX_NAME);
  }

  updateSearchResults(searchQuery, page) {
    console.log(`Refreshing search results with query ${searchQuery}`);
    this.moviesIndex.search({ query: searchQuery })
        .then(results => {
            console.log(`Got ${results.length} results`);
            console.log(results);
            this.setState({ 
              results: results,
              hits: results.hits,
              totalHits: results.nbHits,
              query: searchQuery,
            });
        });
  }

  onEntryDeleted(movieId) {
    // Search seems to be eventually consistent so refreshing the search results won't remove the item
    // Filter the results list manually to remove it immediately
    let newHits = this.state.results.hits.filter(e => e.objectID !== movieId);
    this.setState({ 
      hits: newHits,
      totalHits: this.state.totalHits - 1,
     });
  }

  hasMoreResults() {
    return this.state.results.page < this.state.results.nbPages;
  }

  onLoadMoreResults() {
    if (this.hasMoreResults()) {
      let nextPage = this.state.results.page + 1;
      console.log(`Loading page ${nextPage}..`);
      this.moviesIndex
          .search({ 
            query: this.state.query, 
            page: nextPage 
          })
          .then(results => {
            console.log('Got more results');
            console.log(results);
            let newHits = this.state.hits.concat(results.hits);
            this.setState({ 
              results: results,
              hits: newHits,
              totalHits: results.nbHits,
            });
          });
    } else {
      console.log('No more results to get');
    }
  }

  onAddMovie() {
    console.log('Triggering add movie');
  }


  render() {
    return (
    <div className="container">
      <SearchBox onQueryChanged={this.updateSearchResults.bind(this)} placeholder="Start typing to discover movies..." />
      <SearchResults hits={this.state.hits} 
                     totalHits={this.state.totalHits}
                     query={this.state.query} 
                     onEntryDeleted={this.onEntryDeleted.bind(this)} 
                     onLoadMoreResults={this.onLoadMoreResults.bind(this)} 
                     onAddMovie={this.onAddMovie.bind(this)} />
    </div>
    );
  }
}

export default App;