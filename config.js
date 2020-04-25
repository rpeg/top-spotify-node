exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? /.*topspot.netlify.app/
  : ['http://localhost:3001/', /.*3001.*/];

exports.SPOTIFY_CONFIG = {
  clientID: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
};
