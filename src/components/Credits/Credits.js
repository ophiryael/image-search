import React from 'react';
import styles from './Credits.module.css';

const links = {
  Pixaby: 'https://pixabay.com/',
  Flickr: 'https://www.flickr.com/'
};

function getLink(key) {
  return (
    <a
      className={styles.link}
      href={links[key]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {key}
    </a>
  );
}

function Credits() {
  return (
    <div className={styles.creditsContainer}>
      <span>
        Images by {getLink('Pixaby')} &amp; {getLink('Flickr')}
      </span>
    </div>
  );
}

export default Credits;
