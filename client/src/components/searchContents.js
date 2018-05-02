import React, { Component } from 'react';
import SearchResults from './searchResults';
import '../style/searchContent.css';

class SearchContent extends Component {
  hasQuery() {
    return this.props.query && this.props.query !== '';
  }

  getSearchHeader() {
    return this.hasQuery() ? `Found ${this.props.totalHits} matches` : '';
  }

  render() {
    return (
      <div className="search-content">
        <div className={this.hasQuery() ? 'search-header' : 'search-header hidden'}>
          <i className="fas fa-video movie-icon"></i><span className="total-results">{this.getSearchHeader()}</span>
          <span className="new-movie-button" onClick={this.props.onAddMovie}>
          Add movie <i className="fas fa-plus-circle"></i>
          </span>
        </div>

        <SearchResults hits={this.props.hits} 
                       totalHits={this.props.totalHits}
                       onEntryDeleted={this.props.onEntryDeleted} 
                       onLoadMoreResults={this.props.onLoadMoreResults} 
                       onAddMovie={this.props.onAddMovie} />
      </div>
    );
  }
}

export default SearchContent;