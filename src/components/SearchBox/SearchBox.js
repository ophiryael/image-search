import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import styles from './SearchBox.module.css';

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.searchTerm
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.setState({ inputValue: this.props.searchTerm });
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit(this.state.inputValue);
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <form className={styles.searchForm} onSubmit={this.handleFormSubmit}>
        <button className={styles.searchBtn}>
          <SearchIcon />
        </button>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search Photos..."
          value={inputValue}
          spellCheck="false"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default SearchBox;
