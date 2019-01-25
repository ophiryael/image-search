import React from 'react';
import DrawerItem from './DrawerItem/DrawerItem';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import styles from './SearchHistoryDrawer.module.css';

function SearchHistoryDrawer({
  items,
  isOpen,
  handleSearchTermChange,
  handleClearSearchHistory
}) {
  const classes = [styles.drawerContainer, isOpen ? styles.open : ''].join(' ');

  return (
    <div className={classes}>
      {items.length > 0 ? (
        <>
          <div className={styles.clearHistoryBtnContainer}>
            <Button onClick={handleClearSearchHistory}>Clear history</Button>
          </div>

          <ul className={styles.historyItemsList}>
            {items.map(item => (
              <DrawerItem
                key={item.timeOfSearch}
                onClick={() => handleSearchTermChange(item.searchTerm)}
                {...item}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.noHistoryContainer}>
          <span>Your recent searches will appear here.</span>
        </div>
      )}
    </div>
  );
}

SearchHistoryDrawer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      searchTerm: PropTypes.string.isRequired,
      timeOfSearch: PropTypes.number.isRequired,
      resultsCount: PropTypes.number.isRequired
    })
  ),
  isOpen: PropTypes.bool.isRequired,
  handleSearchTermChange: PropTypes.func.isRequired,
  handleClearSearchHistory: PropTypes.func.isRequired
};

export default SearchHistoryDrawer;
