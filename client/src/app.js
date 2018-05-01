import React, { Component } from 'react';
import './style/app.css';
import searchIcon from './img/search-icon.svg';
import movieIcon from './img/film.svg';
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
      <SearchBox onQueryChanged={this.updateSearchResults.bind(this)} placeholder="Start typing to discover movies..." />
      <SearchResults results={this.state.results} query={this.state.query} />
    </div>
    );
  }
}

class SearchBox extends Component {
  INPUT_DELAY_MS = 300;
  state = {
    query: '',
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

  render() {
    return (
      <div className="search-box">
        <img src={searchIcon} alt='Search for a movie!'/>
        <input className="search-input" type="text" placeholder={this.props.placeholder} onChange={evt => this.onInputChange(evt)}/>
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
        results.push(<SearchEntry movieData={movie} idx={index} key={`${index}-entry`} />);
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

    return (
      <div className="search-entry">
        <span className="index">{this.props.idx + 1}</span>
        <img src={this.props.movieData.image} className="movie-image" />
        <span className="info" >
            <div className="title" dangerouslySetInnerHTML={{__html: this.props.movieData._highlightResult.title.value}} />
            <div className="secondary" dangerouslySetInnerHTML={{__html: secondary}}/>
            <div className="actors" dangerouslySetInnerHTML={{__html: actors}}/>
        </span>
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
