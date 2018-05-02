import React, { Component } from 'react';
import SearchResults from './searchResults';
import AddMovie from './addMovie';
import '../style/searchContent.css';

const Views = {
    RESULTS: 'results',
    ADD_MOVIE: 'add-movie',
}

class SearchContent extends Component {
  state = {
    view: Views.RESULTS,
  };

  hasQuery() {
    console.log(`State: ${this.state.view}`);
    return this.props.query && this.props.query !== '';
  }

  onAddMovie() {
    console.log(`SearchContent: Add movie`);
    this.setState({
        view: this.state.view === Views.RESULTS ? 
            Views.ADD_MOVIE : 
            Views.RESULTS,
    })
    this.props.onAddMovie();
  }

  render() {
    return (
      <div className="search-content">
        <SearchHeader hidden={!this.hasQuery()} 
                      view={this.state.view}
                      onAddMovie={this.onAddMovie.bind(this)}
                      totalHits={this.props.totalHits} />
        {this.state.view === Views.RESULTS ? (
            <SearchResults hits={this.props.hits} 
                                    totalHits={this.props.totalHits}
                                    hidden={!this.hasQuery()}
                                    onEntryDeleted={this.props.onEntryDeleted} 
                                    onLoadMoreResults={this.props.onLoadMoreResults} /> 
        ): (
            <AddMovie />
        )}
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
            {this.props.view !== Views.ADD_MOVIE ? (
              <span className="new-movie-button" onClick={this.props.onAddMovie}>
              Add movie <i className="fas fa-plus-circle"></i>
              </span>
            ) : (
              <span className="new-movie-button return" onClick={this.props.onAddMovie}>
              Return to results<i className="return-button fas fa-reply"></i>
              </span>
            )}
          </div>
        );
    }
    
}

export default SearchContent;