import React, { Component } from 'react';
import searchIcon from '../img/search-icon.svg';
import '../style/searchBox.css';

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

export default SearchBox;