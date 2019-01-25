import React from 'react';
import PropTypes from 'prop-types';
import styles from './DrawerItem.module.css';

function formatTimeOfSearch(unixTime) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date(unixTime));
}

function DrawerItem({ onClick, searchTerm, timeOfSearch, resultsCount }) {
  return (
    <li className={styles.drawerItem} onClick={onClick}>
      <span className={styles.searchTerm}>{searchTerm}</span>
      <div className={styles.searchDetails}>
        <span>{resultsCount} results</span>
        <span>{formatTimeOfSearch(timeOfSearch)}</span>
      </div>
    </li>
  );
}

DrawerItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  timeOfSearch: PropTypes.number.isRequired,
  resultsCount: PropTypes.number.isRequired
};

export default DrawerItem;
