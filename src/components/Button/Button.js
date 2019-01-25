import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({ onClick, children }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired
};

export default Button;
