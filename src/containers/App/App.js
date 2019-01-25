import React, { Component } from 'react';
import Credits from '../../components/Credits/Credits';
import BackgroundSlides from '../../components/BackgroundSlides/BackgroundSlides';
import Navbar from '../../components/Navbar/Navbar';
import SearchHistoryDrawer from '../../components/SearchHistoryDrawer/SearchHistoryDrawer';
import SearchResults from '../SearchResults/SearchResults';
import './App.css';

// LS = local storage
const LS_SEARCH_HISTORY_KEY = 'searchHistory';
// only the most recent searches will be saved to LS
const MAX_LS_ITEMS = 50;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchHistory: this.getLocalStorageSearchHistory() || [],
      isHistoryDrawerOpen: false
    };
  }

  handleSearchTermChange = searchTerm => {
    this.setState({ searchTerm, isHistoryDrawerOpen: false });
  };

  handleHistoryDrawerToggle = () => {
    this.setState(prevState => ({
      isHistoryDrawerOpen: !prevState.isHistoryDrawerOpen
    }));
  };

  handleClearSearchHistory = () => {
    this.setState(
      { searchHistory: [], isHistoryDrawerOpen: false },
      this.saveSearchHistoryToLocalStorage
    );
  };

  addToSearchHistory = searchDetails => {
    this.setState(
      prevState => ({
        searchHistory: [...prevState.searchHistory, searchDetails]
      }),
      this.saveSearchHistoryToLocalStorage
    );
  };

  saveSearchHistoryToLocalStorage() {
    const { searchHistory } = this.state;

    localStorage.setItem(
      LS_SEARCH_HISTORY_KEY,
      JSON.stringify(searchHistory.slice(-MAX_LS_ITEMS))
    );
  }

  getLocalStorageSearchHistory() {
    const searchHistory = localStorage.getItem(LS_SEARCH_HISTORY_KEY);
    return JSON.parse(searchHistory);
  }

  render() {
    const { searchTerm, searchHistory, isHistoryDrawerOpen } = this.state;

    return (
      <>
        <header>
          <Navbar
            searchTerm={searchTerm}
            handleSearchTermChange={this.handleSearchTermChange}
            handleHistoryDrawerToggle={this.handleHistoryDrawerToggle}
          />
        </header>
        <main>
          {searchTerm ? (
            <SearchResults
              searchTerm={searchTerm}
              addToSearchHistory={this.addToSearchHistory}
            />
          ) : (
            <BackgroundSlides />
          )}

          <SearchHistoryDrawer
            items={searchHistory}
            isOpen={isHistoryDrawerOpen}
            handleSearchTermChange={this.handleSearchTermChange}
            handleClearSearchHistory={this.handleClearSearchHistory}
          />
          <Credits />
        </main>
      </>
    );
  }
}

export default App;
