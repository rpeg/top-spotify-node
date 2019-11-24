const passport = require("passport");
const SpotifyApi = require("../lib/spotify-api");
const SpotifyStrategy = require("passport-spotify").Strategy;
const { SPOTIFY_CONFIG } = require("../config");

module.exports = () => {
  passport.serializeUser((profile, cb) => cb(null, profile));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = (accessToken, refreshToken, profile, cb) => {
    const spotifyApi = new SpotifyApi().getInstance();
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    cb(null, profile);
  };

  passport.use(new SpotifyStrategy(SPOTIFY_CONFIG, callback));
};
