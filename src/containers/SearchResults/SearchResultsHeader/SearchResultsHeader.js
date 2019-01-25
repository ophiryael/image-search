import React from 'react';
import PropTypes from 'prop-types';
import styles from './SearchResultsHeader.module.css';

function SearchResultsHeader({ searchTerm, resultsCount }) {
  return (
    <div className={styles.resultsHeaderContainer}>
      <h1>{searchTerm} images</h1>
      {resultsCount !== null && <span>{resultsCount} images found.</span>}
    </div>
  );
}

SearchResultsHeader.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  resultsCount: PropTypes.number
};

export default SearchResultsHeader;
