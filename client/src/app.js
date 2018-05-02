import React, { Component } from 'react';
import AlgoliaClient from 'algoliasearch';
import axios from 'axios';

import './style/app.css';
import searchIcon from './img/search-icon.svg';
import movieIcon from './img/film.svg';
import deleteSpinner from './img/loading-red.svg';

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

class SearchBox extends Component {
  INPUT_DELAY_MS = 150;
  state = {
    query: '',
    focused: false,
  };

  constructor(props) {
    super(props);
    this.onQueryChanged = props.onQueryChanged;
    this.typingTimeout = null;
  }

  onInputChange(evt) {
    clearTimeout(this.typingTimeout);

    let inputValue = evt.target.value;
    console.log(inputValue);
    this.typingTimeout = setTimeout(function() {
        this.onQueryChanged(inputValue);
        this.setState({query: inputValue});
    }.bind(this), this.INPUT_DELAY_MS);
  }

  toggleFocus(val) {
    this.setState({ focused: val });
  }

  render() {
    let boxClass = 'search-box';
    if (this.state.focused) boxClass += ' focused';

    return (
      <div className={boxClass}>
        <img src={searchIcon} alt='Search for a movie!'/>
        <input className="search-input" type="text" placeholder={this.props.placeholder} onChange={evt => this.onInputChange(evt)} onFocus={evt => this.toggleFocus(true)} onBlur={evt => this.toggleFocus(false)}/>
      </div>
    );
  }
}

class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  hasQuery() {
    return this.props.query && this.props.query !== '';
  }

  getSearchHeader() {
    if (!this.hasQuery()) {
      return '';
    }
    return `Found ${this.props.results.nbHits} matches`;

  }

  render() {
    let headerClasses = 'search-header';
    if (!this.hasQuery()) {
      headerClasses += ' hidden';
    }

    // let results = [<SearchEntryPlaceholder key='1' />];
    let results = [];
    if (this.hasQuery()) {
      this.props.results.hits.forEach((movie, index, arr) => {
        results.push(
            <SearchEntry movieData={movie} idx={index} key={`${index}-entry`} onDeleted={this.props.onEntryDeleted} />
        );
        if (index != (arr.length - 1)) {
          results.push(<SearchDivider key={`${index}-divider`} />);
        }
        
      });
    }

    return (
      <div className="search-content">
        <div className={headerClasses}>
          {/* <i className="fas fa-film movie-icon"></i><span>Found some stuff</span> */}
          <i className="fas fa-video movie-icon"></i><span>{this.getSearchHeader()}</span>
        </div>
        <div className="search-results"> 
        {results}
        </div>
      </div>
    );
  }
}

class SearchEntry extends Component {
  state = {deleting: false};

  deleteMovie(movieId) {
    console.log(`Deleting movie ${movieId}`);
    this.setState({deleting: true})

    axios.delete(`/api/1/movies/${movieId}`)
         .then(response => {
             console.log(`Deleted: ${response.status}`)
             this.setState({deleting: false});
             this.props.onDeleted(movieId);
         });
  }

  render() {
    let genres = this.props.movieData._highlightResult.genre || [];
    let actors = this.props.movieData._highlightResult.actors || [];

    let secondary = this.props.movieData.year + ' | ' + genres.map((e) => e.value).join(', ');
    actors = actors.map(e => e.value);
    if (actors.length > 4) {
        actors = actors.slice(0, 4).join(', ');
        actors = actors + '...';
    }
    else {
        actors = actors.join(', ');
    }

    let deleteElem = this.state.deleting ? 
        <img className="delete-spinner" src={deleteSpinner} /> :
        <i className="delete-button fas fa-times-circle" onClick={evt => this.deleteMovie(this.props.movieData.objectID)} />;

    return (
      <div className="search-entry">
        <span className="index">{this.props.idx + 1}.</span>
        <img src={this.props.movieData.image} className="movie-image" />
        <span className="info" >
            <div className="title" dangerouslySetInnerHTML={{__html: this.props.movieData._highlightResult.title.value}} />
            <div className="secondary" dangerouslySetInnerHTML={{__html: secondary}}/>
            <div className="actors" dangerouslySetInnerHTML={{__html: actors}}/>
        </span>
        { deleteElem }
      </div>
    );
  }
}

class SearchDivider extends Component {
  render() {
    return (
      <div className="search-divider" />
    );
  }
}

class SearchEntryPlaceholder extends SearchEntry {
  render() {
    return (
      <div className="search-entry">
        Nothing to show. Start typing to discover movies...
      </div>
    );
  }
}



export default App;
