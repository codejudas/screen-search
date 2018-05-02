import React, { Component } from 'react';
import axios from 'axios';

import '../style/searchResults.css';
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
    return `Found ${this.props.totalHits} matches`;

  }

  render() {
    let results = [];
    if (this.hasQuery()) {
      this.props.hits.forEach((movie, index, arr) => {
        results.push(
          <SearchEntry movieData={movie} idx={index} key={`${index}-entry`} onDeleted={this.props.onEntryDeleted} />
        );
        results.push(
          <SearchDivider key={`${index}-divider`} />
        );

        if (index === (arr.length - 1) && this.props.hits.length < this.props.totalHits) {
          results.push(<SearchMoreButton key={`${index}-load-more-button`} onClick={this.props.onLoadMoreResults}/>);
        }
        
      });
    }

    return (
      <div className="search-content">
        <div className={this.hasQuery() ? 'search-header' : 'search-header hidden'}>
          <i className="fas fa-video movie-icon"></i><span className="total-results">{this.getSearchHeader()}</span>
          <span className="new-movie-button" onClick={this.props.onAddMovie}>
          Add movie <i className="fas fa-plus-circle"></i>
          </span>
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
          <div className="title" dangerouslySetInnerHTML={{ __html: this.props.movieData._highlightResult.title.value }} />
          <div className="secondary" dangerouslySetInnerHTML={{ __html: secondary }} />
          <div className="actors" dangerouslySetInnerHTML={{ __html: actors }} />
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

class SearchMoreButton extends SearchEntry {
  render() {
    return (
      <div className="search-entry search-more-button" onClick={this.props.onClick}>
        <i className="fas fa-chevron-circle-down" />
      </div>
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