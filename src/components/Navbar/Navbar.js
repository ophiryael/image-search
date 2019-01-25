import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../Logo/Logo';
import SearchBox from '../SearchBox/SearchBox';
import Button from '../Button/Button';
import styles from './Navbar.module.css';

function Navbar({
  searchTerm,
  handleSearchTermChange,
  handleHistoryDrawerToggle
}) {
  return (
    <div className={styles.navbarContainer}>
      <Logo onClick={() => handleSearchTermChange('')} />
      <SearchBox
        searchTerm={searchTerm}
        handleSubmit={handleSearchTermChange}
      />
      <Button onClick={handleHistoryDrawerToggle}>History</Button>
    </div>
  );
}

Navbar.propTypes = {
  handleSearchTermChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  handleHistoryDrawerToggle: PropTypes.func.isRequired
};

export default Navbar;
