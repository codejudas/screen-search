import React, { Component } from 'react';
import AlgoliaClient from 'algoliasearch';
import axios from 'axios';
import SearchBox from './components/searchBox';
import SearchContent from './components/searchContents';

import './style/app.css';
import algoliaLogo from './img/algolia-logo-dark.png';

class App extends Component {
  state = {
    query: '',
    totalHits: 0,
    hits: [],
    results: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Connecting to backend...');
    axios.get('/api/1/credentials')
         .then(resp => {
            this.client = AlgoliaClient(resp.data.app_id, resp.data.search_api_key);
            this.moviesIndex = this.client.initIndex(resp.data.index_name);
            console.log('Connected');
         });
  }

  updateSearchResults(searchQuery, page) {
    if (!this.moviesIndex) return;

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
    let newHits = this.state.hits.filter(e => e.objectID !== movieId);
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
      <SearchContent hits={this.state.hits} 
                     totalHits={this.state.totalHits}
                     query={this.state.query} 
                     onEntryDeleted={this.onEntryDeleted.bind(this)} 
                     onLoadMoreResults={this.onLoadMoreResults.bind(this)} 
                     onAddMovie={this.onAddMovie.bind(this)} />
      <img id='algolia-logo' src={algoliaLogo} alt='Powered by Algolia' />
    </div>
    );
  }
}

export default App;
