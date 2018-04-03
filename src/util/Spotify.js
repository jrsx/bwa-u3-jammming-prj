var userAccessToken = '';
var client_id = '36fc8722a53a4248b9dc7824bd827eab';
var redirect_uri = 'http://disagreeable-angle.surge.sh/';
var authEndPoint = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=playlist-modify-public&response_type=token`;
//https://cors-anywhere.herokuapp.com/

const Spotify = {
  getAccessToken() {
    if (userAccessToken.length) {
      console.log('Returning userAccessToken ' + userAccessToken);
      return userAccessToken;
    }
    else {
      var accessToken = window.location.href.match(new RegExp(/access_token=([^&]*)/));
      var expiresIn = window.location.href.match(new RegExp(/expires_in=([^&]*)/));

      if (accessToken && expiresIn) {
        userAccessToken = accessToken[1];
        console.log('Access Token of user: ' + userAccessToken);
        console.log('Expires in: ' + expiresIn[1]);
        window.setTimeout(() => accessToken[1] = '', expiresIn[1] * 1000);
        window.history.pushState('Access Token', null, '/');
        return userAccessToken;
      }
      else {
        console.log('no token, redirect user');
        window.location = authEndPoint;
      }
    }
  },

  search(searchTerm) {
    console.log('Using access token: '+ userAccessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        "Authorization": `Bearer ${userAccessToken}`,
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if(response.ok) {
        console.log('Response OK! Returning JSON...');
        return response.json();
      }
      throw new Error('Request failed!');
    }, function (networkError) {
      console.log(networkError.message);
    }).then(function(jsonResponse) {
      if (jsonResponse.tracks) {
        return (jsonResponse.tracks.items.map(track => {
          console.log('track id: ' + track.id + ' track.name: ' + track.name + ' artist: ' + track.artists[0].name);
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        }));
      }
    });
  },

  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }

    var accessToken = userAccessToken;
    var headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
    var userID = '';
    var playlistID = '';

    // Get user ID
    console.log('Getting User ID...');
    try {
      let response = await fetch('https://api.spotify.com/v1/me', {
        headers: headers
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse.id) {
          userID = jsonResponse.id;
        }
      };
    } catch (error) {
      console.log(error);
    }

    console.log('User ID: ' + userID);
    console.log('POSTing Playlist ' + playlistName + '...');
    // POST new PlayList and set returned playlist ID
    try {
      let response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: playlistName
        })
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse.id) {
          playlistID = jsonResponse.id;
        }
      };
    } catch (error) {
      console.log(error);
    }

    console.log('PlaylistID: ' + playlistID);
    console.log('POSTing tracks to playlist...');
    // POST new tracks to new PlayList
    try {
      let response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${userAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uris: trackURIs
        })
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse.id) {
          playlistID = jsonResponse.id;
        }
      };
    } catch (error) {
      console.log(error);
    }
    console.log('DONE!');
  }
};

export default Spotify;
