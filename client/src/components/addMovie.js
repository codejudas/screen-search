import React, { Component } from 'react';
import axios from 'axios';

import '../style/addMovie.css';
import loading from '../img/loading-black.svg';

const Pages = {
    TITLE: 'title',
    YEAR: 'year',
    GENRES: 'genre',
    ACTORS: 'actors',
    IMAGE: 'image',
    RATING: 'rating',
    ALT_TITLES: 'alternative_titles',
}

const PAGE_ORDER = [
    Pages.TITLE,
    Pages.YEAR,
    Pages.GENRES,
    Pages.ACTORS,
    Pages.RATING,
    Pages.IMAGE,
    Pages.ALT_TITLES,
]

const PAGE_LABELS = {
    'title': 'What\'s the movie called?',
    'year': 'When did it come out?',
    'genre': 'What genres best describe it?',
    'actors': 'Who played in it?',
    'rating': 'How would you rate this movie out of 5?',
    'image': 'Do you have a link to the poster? (Optional)',
    'alternative_titles': 'What\'s this movie called in other languages? (Optional)',
}

const PAGE_PLACEHOLDERS = {
    'title': 'Lost in Translation',
    'year': '2003',
    'genre': 'Drama, Indie Film',
    'actors': 'Scarlett Johansson, Bill Murray, Bob Harris, Akiko Takeshita',
    'image': 'https://',
    'rating': '3',
    'alternative_titles': 'Perdidos en Tokio, Tõlkes kaduma läinud',
}

class Parsers {
    static str = (input) => input;

    static year(input) {
        try {
            let yr = parseInt(input, 10);
            if (yr <= 0) throw new Error('Invalid year');
            return yr;
        } catch(err) { return null; }
    }

    static list = (input) => input.split(',')
                                  .map(e => e.trim())
                                  .filter(e => !!e);

    static url(input) {
        if (!input.startsWith('https://') && !input.startsWith('http://')) return null;
        return input;
    }

    static rating(input) {
        try {
            let rat = parseInt(input, 10);
            if (rat < 0 || rat > 5) throw new Error('Invalid Rating');
            return rat;
        } catch(err) { return null; }
    }
}

 const PAGE_PARSER = {
    'title': Parsers.str,
    'year': Parsers.year,
    'genre': Parsers.list,
    'actors': Parsers.list,
    'image': Parsers.url,
    'rating': Parsers.rating,
    'alternative_titles': Parsers.list,
 }

// const OPTIONAL_PAGES = new Set(Pages.ALT_TITLES, Pages.IMAGE);
 const OPTIONAL_PAGES = {
    'image': true,
    'alternative_titles': true,
 }

class AddMovie extends Component {
  state = {
    index: 0,
    data: {},
    focused: false,
    submitting: false,
    done: false,
  };

  componentWillMount() {
      this.setState({
          index: 0,
          data: {},
          submitting: false,
          done: false,
      });
  }

  pageIsOptional(idx) {
    idx = idx || this.state.index;
    return !!OPTIONAL_PAGES[PAGE_ORDER[idx]];
  }

  isLastPage() {
      return this.state.index === (PAGE_ORDER.length - 1);
  }

  toggleFocus(val) {
    this.setState({focused: val});
  }

  getCurrentPage() {
    return PAGE_ORDER[this.state.index];
  }

  getProgressWidth() {
    let prctComplete = ((this.state.index + 1) / (PAGE_ORDER.length)) * 100;
    console.log(`Percent complete ${prctComplete}`);
    return `${prctComplete}%`;
  }

  nextPage() {
      console.log(`NExt page called`);
      let parsedVal = PAGE_PARSER[this.getCurrentPage()](this.textInput.value);

      // Clear the input
      this.textInput.value = '';

      if (!parsedVal && !this.pageIsOptional()) { return; }

      this.state.data[this.getCurrentPage()] = parsedVal;
      console.log(`Data ${JSON.stringify(this.state.data)}`);

      if (this.isLastPage(this.nextPage)) {
          this.setState({submitting: true});

          this.state.data.score = '6.9';
          this.state.data.actor_facets = [];
          this.state.data.color = '#ffff';
          console.log(`No more pages left. Submitting ${JSON.stringify(this.state.data)}`);

          axios.post('/api/1/movies', this.state.data)
               .then(resp => {
                   console.log(`Successfully added movie`);
                   console.log(resp);
                   this.setState({
                       submitting: false,
                       done: true,
                    });
               })
      } else {
          this.setState({
              index: this.state.index + 1,
              data: this.state.data,
          });
      }
  }

  getLabel() {
    return this.state.done ? 'All Done!' : PAGE_LABELS[this.getCurrentPage()];
  }

  getPlaceholder() {
    return this.state.done? `${this.state.data.title} was successfully added` : PAGE_PLACEHOLDERS[this.getCurrentPage()];
  }

  render() {
    let curPage = PAGE_ORDER[this.state.index];
    console.log(`Current page ${curPage}`);
    return (
        <div className="add-movie-panel">
            <div className="input-group">
                <div className="input-label">{this.getLabel()}</div>
                <div className={this.state.focused ? "input-box focused" : "input-box"}>
                    <input type='text' 
                           ref={(e) => this.textInput = e} 
                           placeholder={this.getPlaceholder()} 
                           onFocus={() => this.toggleFocus(true)}
                           onBlur={() => this.toggleFocus(false)} 
                           disabled={this.state.done}
                           />
                    {!this.isLastPage() ? (
                        <i className="next-button fas fa-arrow-alt-circle-right" onClick={this.nextPage.bind(this)}/>
                    ) : (!this.state.submitting ? (
                        <i className="next-button fas fa-check-circle" onClick={this.nextPage.bind(this)}/>
                        ) : (
                        <img src={loading} className="submiting-spiral" alt='Submitting movie'/>
                        )
                    )}
                </div>
                <span className="progress-bar" style={{width: this.getProgressWidth()}} />
                <span className="progress-indicator" >{this.state.index + 1} / {PAGE_ORDER.length}</span>
            </div>
        </div>
    );
  }
}

export default AddMovie;