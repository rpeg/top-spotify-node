exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://topspotify.netlify.com'
  : ['http://localhost:3001/', /.*3001.*/];

exports.SPOTIFY_CONFIG = {
  clientID: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL:
    process.env.NODE_ENV === 'production'
      ? 'https://top-spotify.herokuapp.com/auth/callback'
      : process.env.CALLBACK_URL,
};
