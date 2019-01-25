import React, { Component } from 'react';
import { ReactComponent as ImageSkeleton } from '../../../assets/images/image_skeleton.svg';
import PropTypes from 'prop-types';
import styles from './Image.module.css';

class Image extends Component {
  state = {
    isLoaded: false
  };

  handleSetIsLoaded = () => {
    this.setState({ isLoaded: true });
  };

  render() {
    const { url } = this.props;
    const { isLoaded } = this.state;

    return (
      <div className={styles.imageContainer}>
        {!isLoaded && <ImageSkeleton />}
        <img
          style={{ display: isLoaded ? 'block' : 'none' }}
          src={url}
          // TODO add alt
          alt=""
          onLoad={this.handleSetIsLoaded}
        />
      </div>
    );
  }
}

Image.propTypes = {
  url: PropTypes.string.isRequired
};

export default Image;
