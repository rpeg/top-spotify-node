const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyApi = require('../lib/spotify-api');
const { SPOTIFY_CONFIG } = require('../config');

module.exports = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = (accessToken, refreshToken, user, cb) => {
    const spotifyApi = new SpotifyApi().getInstance();
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    cb(null, user);
  };

  passport.use(new SpotifyStrategy(SPOTIFY_CONFIG, callback));
};
