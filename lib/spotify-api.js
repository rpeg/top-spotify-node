const SpotifyWebApi = require("spotify-web-api-node");

const credentials = {
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL
};

class SpotifyApiSingleton {
  constructor() {
    if (!SpotifyApiSingleton.instance) {
      SpotifyApiSingleton.instance = new SpotifyWebApi(credentials);
    }
  }

  getInstance() {
    return SpotifyApiSingleton.instance;
  }
}

module.exports = SpotifyApiSingleton;
