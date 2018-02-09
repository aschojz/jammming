import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Joschas Liste',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    const isInList = this.state.playlistTracks.some( playlistTrack => playlistTrack.id === track.id );
    if(!isInList){
      this.setState({
        playlistTracks: this.state.playlistTracks.concat(track)
      })
    }
  }

  removeTrack(track){
    const index = this.state.playlistTracks.findIndex( playlistTrack => playlistTrack.id === track.id );
    this.state.playlistTracks.splice(index, 1);
    this.setState({
      playlistTracks: this.state.playlistTracks
    });
  }

  updatePlaylistName(name){
    this.setState({
      playlistName: name
    });
  }

  savePlaylist(){
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => trackURIs.push(track.uri));
  }

  search(term){
    Spotify.search(term).then( results => {
      console.log(results);
      this.setState({searchResults: results});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}></SearchBar>
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}>
            </SearchResults>
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist}>
            </Playlist>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
