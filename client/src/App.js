import React, { Component } from 'react';
import './style/app.css';
import searchIcon from './img/search-icon.svg';
import AlgoliaClient from 'algoliasearch';

class App extends Component {
  APP_ID = 'BY41L4QN3A';
  SEARCH_ONLY_API_KEY = 'e63bfd56ed5ae8facc75497aa9928062';
  INDEX_NAME = 'movies';

  state = {
    results: { hits: [] },
  };

  constructor(props) {
    super(props);
    this.client = AlgoliaClient(this.APP_ID, this.SEARCH_ONLY_API_KEY);
    this.moviesIndex = this.client.initIndex(this.INDEX_NAME);
  }

  updateSearchResults(searchQuery) {
    console.log(`Refreshing search results with query ${searchQuery}`);
    console.log(this.moviesIndex);
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

  render() {
    return (
    <div className="container">
      <SearchBox onQueryChanged={this.updateSearchResults.bind(this)} />
      <SearchResults results={this.state.results} query={this.state.query} />
    </div>
    );
  }
}

class SearchBox extends Component {
  state = {
    query: '',
  };

  constructor(props) {
    super(props);
    this.onQueryChanged = props.onQueryChanged;
  }

  onInputChange(evt) {
    let inputValue = evt.target.value;
    console.log(inputValue);
    this.setState({
      query: inputValue
    });
    
    // TODO: Dont do this on every change
    this.onQueryChanged(inputValue);
  }

  render() {
    return (
      <div className="search-box">
        <img src={searchIcon} alt='Search for a movie!'/>
        <input className="search-input" type="text" placeholder="TBD" onChange={evt => this.onInputChange(evt)}/>
      </div>
    );
  }
}

class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ol className="search-results"> 
        { this.props.results.hits.map(movie => 
            <li key={movie.title}>{movie.title}</li>
          )}
      </ol>
    );
  }
}



export default App;
