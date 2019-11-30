const express = require('express');

const router = express.Router();
const passport = require('passport');
const chunk = require('lodash/chunk');
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

router.get('/auth/callback', spotifyAuth, async (req) => {
  const io = req.app.get('io');

  const user = {
    id: req.user.id,
    image: req.user.photos[0],
  };

  io.in(req.session.socketId).emit('spotifyUser', user);
});

// Fetches `n` artists in accordance with limit, emitting an aggregate result
// Note: Spotify does not currently provide >50 results, but may change this in the future.
router.get('/api/my-top-artists', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : DEF_PERSONALIZATION_LIMIT;
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

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send(err);
    });
});

// Fetches `n` tracks in accordance with limit, emitting an aggregate result
// Note: Spotify does not currently provide >50 results, but may change this in the future.
router.get('/api/my-top-tracks', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : DEF_PERSONALIZATION_LIMIT;
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

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send(err);
    });
});

router.get('/api/track-features', async (req, res) => {
  const chunkedIds = chunk(req.query.ids.split(','), FEATURE_LIMIT);
  const promises = [];

  console.log(chunkedIds);

  for (let i = 0; i < chunkedIds.length; i += 1) {
    promises.push(spotifyApi.getAudioFeaturesForTracks(chunkedIds[i]));
  }

  await Promise.all(promises)
    .then((results) => {
      const result = {
        items: results.map((r) => r.body.audio_features).flat(),
        range: req.query.time_range,
      };

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send(err);
    });
});

module.exports = router;
