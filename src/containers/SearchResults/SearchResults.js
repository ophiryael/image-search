import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Image from './Image/Image';
import SearchStatus from './SearchStatus/SearchStatus';
import SearchResultsHeader from './SearchResultsHeader/SearchResultsHeader';
import axios from 'axios';
import { debounce } from 'lodash';
import styles from './SearchResults.module.css';

const API_KEYS = {
  PIXABY: '11370902-19d6d747d66b3dd76f6049b2b',
  FLICKR: 'dd4a16666bdf3c2180b43bec8dd1534a'
};

// number of results per api request (results per page)
const RESULTS_PER_REQUEST = 20;

// number of items to render when the user reaches the end of the results container
const ITEMS_PER_SCROLL = 10;

// request will be sent whenever the difference between the available (unrendered) results
// and the rendered results is less than or equal to this number.
const ITEMS_BUFFER = 10;

// arbitrary value for initial load
const INITIAL_RENDERED_ITEMS = 25;

const INITIAL_API_STATE = {
  pixaby: {
    nextPage: 1,
    lastPage: null
  },
  flickr: {
    nextPage: 1,
    lastPage: null
  }
};

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.renderItemsListener = debounce(this.renderItems, 100);

    this.availableItems = [];
    this.apiState = { ...INITIAL_API_STATE };

    this.state = {
      renderedItemsCount: INITIAL_RENDERED_ITEMS,
      isLoadingResults: false,
      resultsCount: null
    };
  }

  componentDidMount() {
    this.getItems();

    // event listener is debounced in order to improve performance.
    document.addEventListener('scroll', this.renderItemsListener);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.resetResults();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.renderItemsListener);
  }

  renderItems = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const isScrollEnd = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    const isResultsEnd = this.state.resultsCount === this.availableItems.length;

    if (isScrollEnd && !isResultsEnd && !this.state.isLoadingResults) {
      const renderedItemsCount =
        this.state.renderedItemsCount + ITEMS_PER_SCROLL;

      const isBufferReached =
        this.availableItems.length - renderedItemsCount <= ITEMS_BUFFER;

      if (isBufferReached) {
        this.getItems();
      }

      this.setState({ renderedItemsCount });
    }
  };

  resetResults() {
    this.availableItems = [];
    this.apiState = { ...INITIAL_API_STATE };

    this.setState(
      {
        renderedItems: 0,
        isLoadingResults: false,
        totalResults: null
      },
      this.getItems
    );
  }

  async getItems() {
    const isNextPageValid = this.getNextApiPagesValidity();

    // the promise API wraps non-promises values in promises and resolve them to themselves.
    // Promise.all([null]) can be seen as Promise.all([Promise.resolve(null)])
    const responses = await this.getRequests([
      isNextPageValid.pixaby ? this.getPixabyRequest() : null,
      isNextPageValid.flickr ? this.getFlickrRequest() : null
    ]);

    // TODO (if undefined, at least one of the requests failed)
    if (!responses) {
      console.log('getItems failed');
      return;
    }

    // at this point, each response can be either null or an actual api result
    const [pixabyResponse, flickrResponse] = responses;

    const apiResults = {
      ...(pixabyResponse && {
        pixaby: this.getPixabyResults(pixabyResponse.data)
      }),
      ...(flickrResponse && {
        flickr: this.getFlickrResults(flickrResponse.data)
      })
    };

    this.availableItems = this.getAvailableItems(apiResults);

    if (this.isInitialResults()) {
      const resultsCount =
        apiResults.pixaby.resultsCount + apiResults.flickr.resultsCount;

      this.setState({ resultsCount });

      this.props.addToSearchHistory({
        searchTerm: this.props.searchTerm,
        timeOfSearch: Date.now(),
        resultsCount
      });
    }

    this.apiState = this.getUpdatedApiState(apiResults);
  }

  getNextApiPagesValidity() {
    return Object.keys(this.apiState).reduce((nextApiPagesValidity, api) => {
      nextApiPagesValidity[api] =
        this.apiState[api].nextPage <= this.apiState[api].lastPage ||
        this.apiState[api].lastPage === null;

      return nextApiPagesValidity;
    }, {});
  }

  async getRequests(pendingRequests) {
    this.setState({ isLoadingResults: true });
    try {
      return await Promise.all(pendingRequests);
    } catch (error) {
      // TODO
      console.log(error);
    } finally {
      this.setState({ isLoadingResults: false });
    }
  }

  async getPixabyRequest() {
    const request = `https://pixabay.com/api/?key=${API_KEYS.PIXABY}&q=${
      this.props.searchTerm
    }&page=${this.apiState.pixaby.nextPage}&per_page=${RESULTS_PER_REQUEST}`;

    return await axios.get(request);
  }

  async getFlickrRequest() {
    const request = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
      API_KEYS.FLICKR
    }&text=${this.props.searchTerm}&page=${
      this.apiState.flickr.nextPage
    }&per_page=${RESULTS_PER_REQUEST}&format=json&nojsoncallback=1`;

    return await axios.get(request);
  }

  getPixabyResults(response) {
    const urls = this.pixabyResponseToUrls(response);

    // the property 'total' specifies the total results count,
    // while the property 'totalHits' specifies the number of results accessible through the API.
    const resultsCount = +response.totalHits;

    return {
      urls,
      resultsCount
    };
  }

  pixabyResponseToUrls(results) {
    return results.hits.map(imgDetails => imgDetails.webformatURL);
  }

  getFlickrResults(response) {
    const urls = this.flickrResponseToUrls(response);

    // the flickr api returns a maximum of 4000 results for any given search query.
    const { total } = response.photos;
    const resultsCount = total > 4000 ? 4000 : +total;

    return {
      urls,
      resultsCount
    };
  }

  flickrResponseToUrls(results) {
    return results.photos.photo.map(
      imgDetails =>
        `https://farm${imgDetails.farm}.staticflickr.com/${imgDetails.server}/${
          imgDetails.id
        }_${imgDetails.secret}.jpg`
    );
  }

  getAvailableItems(apiResults) {
    const apiResultsUrls = Object.keys(apiResults).reduce(
      (apiResultsUrls, apiKey) => {
        return [...apiResultsUrls, ...apiResults[apiKey].urls];
      },
      []
    );

    return [...this.availableItems, ...apiResultsUrls];
  }

  isInitialResults() {
    const { pixaby, flickr } = this.apiState;
    return pixaby.lastPage === null && flickr.lastPage === null;
  }

  getUpdatedApiState(apiResults) {
    const changedApiState = Object.keys(apiResults).reduce(
      (apiState, apiKey) => {
        apiState[apiKey] = {
          nextPage: this.apiState[apiKey].nextPage + 1,
          lastPage: Math.ceil(
            apiResults[apiKey].resultsCount / RESULTS_PER_REQUEST
          )
        };

        return apiState;
      },
      {}
    );

    return {
      ...this.apiState,
      ...changedApiState
    };
  }

  render() {
    const { searchTerm } = this.props;
    const { isLoadingResults, resultsCount, renderedItemsCount } = this.state;

    const images = this.availableItems
      .slice(0, renderedItemsCount)
      .map(item => <Image key={item} url={item} />);

    return (
      <div className={styles.searchResultsContainer}>
        <SearchResultsHeader
          searchTerm={searchTerm}
          resultsCount={resultsCount}
        />

        <section className={styles.imagesContainer}>{images}</section>

        <SearchStatus
          isLoading={isLoadingResults}
          resultsCount={resultsCount}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  addToSearchHistory: PropTypes.func.isRequired
};

export default SearchResults;
