console.log('keys.js is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
  app_id: process.env.BANDS_ID
};

exports.omdb = {
  key: process.env.OMDB_ID
};