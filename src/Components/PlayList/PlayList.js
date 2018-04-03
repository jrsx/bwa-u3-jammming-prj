import React, { Component } from 'react';
import { TrackList } from '../TrackList/TrackList';
import './PlayList.css';

export class PlayList extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
      this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input onChange={this.handleNameChange} defaultValue={'New Playlist'} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} renderAction={this.props.renderAction} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
