import React, { Component } from 'react';
import axios from 'axios';

import '../style/searchResults.css';
import movieIcon from '../img/film.svg';
import deleteSpinner from '../img/loading-red.svg';

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

export default SearchResults;