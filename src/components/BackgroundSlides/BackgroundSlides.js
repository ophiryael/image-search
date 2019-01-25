import React, { Component } from 'react';
import backgroundImages from './backgroundImages';
import styles from './BackgroundSlides.module.css';

// slide duration in ms
const SLIDE_DURATION = 3500;

class BackgroundSlides extends Component {
  constructor(props) {
    super(props);

    this.nextSlideTimeout = null;

    this.state = {
      currentSlideIdx: 1
    };
  }

  componentDidMount() {
    this.queueNextSlide();
  }

  componentWillUnmount() {
    this.clearSlidesQueue();
  }

  queueNextSlide() {
    this.nextSlideTimeout = setTimeout(() => {
      this.setState(prevState => {
        const isLastSlide =
          prevState.currentSlideIdx === backgroundImages.length - 1;

        return {
          currentSlideIdx: isLastSlide ? 0 : prevState.currentSlideIdx + 1
        };
      }, this.queueNextSlide);
    }, SLIDE_DURATION);
  }

  clearSlidesQueue() {
    clearTimeout(this.nextSlideTimeout);
  }

  render() {
    const { currentSlideIdx } = this.state;
    const backgroundImage = `url(${backgroundImages[currentSlideIdx]})`;

    return (
      <div className={styles.backgroundSlides} style={{ backgroundImage }} />
    );
  }
}

export default BackgroundSlides;
