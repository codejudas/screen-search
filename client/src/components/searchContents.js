import React, { Component } from 'react';
import SearchResults from './searchResults';
import '../style/searchContent.css';

class SearchContent extends Component {
  hasQuery() {
    return this.props.query && this.props.query !== '';
  }
  render() {
    return (
      <div className="search-content">
        <SearchHeader hidden={!this.hasQuery()} 
                      onAddMovie={this.props.onAddMovie}
                      totalHits={this.props.totalHits} />
        <SearchResults hits={this.props.hits} 
                       totalHits={this.props.totalHits}
                       hidden={!this.hasQuery()}
                       onEntryDeleted={this.props.onEntryDeleted} 
                       onLoadMoreResults={this.props.onLoadMoreResults} />
      </div>
    );
  }
}

class SearchHeader extends Component {
    getSearchHeaderText() {
        return !this.props.hidden ? `Found ${this.props.totalHits} matches` : '';
    }

    render() {
        return (
          <div className={this.props.hidden ? 'search-header hidden' : 'search-header'}>
          <i className="fas fa-video movie-icon"></i><span className="total-results">{this.getSearchHeaderText()}</span>
          <span className="new-movie-button" onClick={this.props.onAddMovie}>
          Add movie <i className="fas fa-plus-circle"></i>
          </span>
          </div>
        );
    }
    
}

export default SearchContent;