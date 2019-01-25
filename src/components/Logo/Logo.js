import React from 'react';
import PropTypes from 'prop-types';
import styles from './Logo.module.css';

function Logo({ onClick }) {
  return (
    // in a real app it should be a link to the home route,
    // since there are no routes in this app, it sets the search term to an empty string
    // which causes the search results component to unmount and "return" to the "home route".
    <button className={styles.logo} onClick={onClick}>
      ImageSearch
    </button>
  );
}

Logo.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Logo;
