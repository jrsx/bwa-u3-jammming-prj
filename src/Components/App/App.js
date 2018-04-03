import React, { Component } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { PlayList } from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.findIndex(playlistTrack => { return playlistTrack.id === track.id }) === -1) {
      // New track not found, add to PlayList
      this.setState({ playlistTracks: this.state.playlistTracks.concat(track) });
    }
  }

  removeTrack(track) {
    // Filter out the track being removed from the current PlayList
    this.setState({ playlistTracks: this.state.playlistTracks.filter(playlistTrack => { return playlistTrack.id !== track.id })})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    // Get User Access Token
    Spotify.getAccessToken();

    // Save playlist tracks
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => {return track.uri;})).then(playlist => {
      this.setState({
        playlistName: "New Playlist",
        searchResults: []
      });
    });
  }

  search(searchTerm) {
    // Get User Access Token
    Spotify.getAccessToken();

    // Search for term
    Spotify.search(searchTerm).then(results => {
      this.setState({ searchResults: results });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} renderAction={false} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} renderAction={true} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}
