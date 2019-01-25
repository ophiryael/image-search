import React from 'react';
import Spinner from '../../../components/Spinner/Spinner';
import PropTypes from 'prop-types';
import styles from './SearchStatus.module.css';

function SearchStatus({ isLoading, resultsCount }) {
  let searchStatus = null;

  if (isLoading) {
    searchStatus = <Spinner />;
  } else if (resultsCount === 0) {
    searchStatus = <span>Sorry, No results found...</span>;
  }

  return <div className={styles.searchStatusContainer}>{searchStatus}</div>;
}

SearchStatus.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  resultsCount: PropTypes.number
};

export default SearchStatus;
