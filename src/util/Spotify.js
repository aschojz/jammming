let accessToken = "";
const clientId = 'd36eedc32e5a4564a0e21c986fc150c7';
const redirectUri = 'http://joschas.surge.sh';

let Spotify = {
    getAccessToken: function(){
        let returnUri = window.location.href;
        let accessTokenMatch = returnUri.match(/access_token=([^&]*)/);
        let expiresInMatch = returnUri.match(/expires_in=([^&]*)/);

        if(accessToken.length > 0) {
            return accessToken;
        }else if(accessTokenMatch && expiresInMatch) {
            const expiresIn = expiresInMatch[1];
            window.setTimeout( () => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken = accessTokenMatch[1];
        }else{
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },
    search: async function (term){
        const accessToken = Spotify.getAccessToken();
        const urlWithKey = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        
        try {
            let response = await fetch(urlWithKey, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if(response.ok){
                let jsonResponse = await response.json();
                //Return an array of Tracks including: ID, name, artist, album, URI
                let result = jsonResponse.tracks.items.map(function(item){
                    return {
                        id: item.id,
                        name: item.name,
                        artist: item.artists[0].name,
                        album: item.album.name,
                        uri: item.uri
                    }
                })
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    },
    savePlaylist: async function(playlistName, uris){
        if(playlistName.length > 0 && uris.length > 0){
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            let userId = '';
            let playlistId = '';
            try {
                // get user-id
                let response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
                if(response.ok){
                    let jsonResponse = await response.json();
                    userId = jsonResponse.id;
                    // create new playlist
                    try {
                        let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                            method: 'POST',
                            body: JSON.stringify({
                                name: playlistName
                            }),
                            headers: headers
                        });
                        if(response.ok){
                            let jsonResponse = await response.json();
                            playlistId = jsonResponse.id;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    // add Tracks to playlist
                    try {
                        let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            method: 'POST',
                            body: JSON.stringify({
                                uris: uris
                            }),
                            headers: headers
                        });
                        if(response.ok){
                            console.log('tracks added');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }else{
            return;
        }
    }
}
export default Spotify;