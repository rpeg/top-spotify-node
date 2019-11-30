const express = require('express');

const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const SpotifyApi = require('../lib/spotify-api');

require('dotenv').config();

const DEF_PERSONALIZATION_LIMIT = 20;
const FEATURE_LIMIT = 100;

const spotifyApi = new SpotifyApi().getInstance();

const spotifyAuth = passport.authenticate('spotify', {
  scope: ['user-top-read'],
});

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

router.get('/', addSocketIdtoSession, spotifyAuth);

router.get('/auth/login', addSocketIdtoSession, spotifyAuth);

router.get('/auth/callback', spotifyAuth, async (req, res) => {
  const io = req.app.get('io');

  const user = {
    id: req.user.id,
    image: req.user.photos[0],
  };

  io.in(req.session.socketId).emit('spotifyUser', user);
});

// Fetches `n` artists in accordance with limit, emitting an aggregate result
// Note: Spotify does not currently provide >50 results, but may change this in the future.
router.get('/api/my-top-artists', addSocketIdtoSession, async (req, res) => {
  const io = req.app.get('io');

  const limit = req.query.limit ? parseInt(req.query.limit) : DEF_PERSONALIZATION_LIMIT;
  const n = req.query.n ? req.query.n : limit;
  const promises = [];

  for (let i = 0; i <= n; i += limit) {
    const options = {
      time_range: req.query.time_range,
      limit: req.query.limit,
      offset: i,
    };

    promises.push(spotifyApi.getMyTopArtists(options));
  }

  await Promise.all(promises)
    .then((results) => {
      const result = {
        items: results.map((r) => r.body.items).flat(),
        range: req.query.time_range,
      };

      io.in(req.session.socketId).emit('topArtists', result);
    })
    .catch((err) => {
      console.log(err);
      io.in(req.session.socketId).emit('error', err);
    });
});

// Fetches `n` tracks in accordance with limit, emitting an aggregate result
// Note: Spotify does not currently provide >50 results, but may change this in the future.
router.get('/api/my-top-tracks', addSocketIdtoSession, async (req, res) => {
  const io = req.app.get('io');

  const limit = req.query.limit ? parseInt(req.query.limit) : DEF_PERSONALIZATION_LIMIT;
  const n = req.query.n ? req.query.n : limit;
  const promises = [];

  for (let i = 0; i <= n; i += limit) {
    const options = {
      time_range: req.query.time_range,
      limit: req.query.limit,
      offset: i,
    };

    promises.push(spotifyApi.getMyTopTracks(options));
  }

  await Promise.all(promises)
    .then((results) => {
      const result = {
        items: results.map((r) => r.body.items).flat(),
        range: req.query.time_range,
      };

      io.in(req.session.socketId).emit('topTracks', result);
    })
    .catch((err) => {
      console.log(err);
      io.in(req.session.socketId).emit('error', err);
    });
});

router.get('/api/track-features', addSocketIdtoSession, async (req, res) => {
  const io = req.app.get('io');

  const chunkedIds = _.chunk(req.query.ids, FEATURE_LIMIT);
  const promises = [];

  for (let i = 0; i < chunkedIds.length; i++) {
    promises.push(spotifyApi.getAudioFeaturesForTracks(chunkedIds[i]));
  }

  await Promise.all(promises)
    .then((results) => {
      const result = {
        items: results.map((r) => r.body.audio_features).flat(),
        range: req.query.time_range,
      };

      io.in(req.session.socketId).emit('features', result);
    })
    .catch((err) => {
      console.log(err);
      io.in(req.session.socketId).emit('error', err);
    });
});

module.exports = router;
