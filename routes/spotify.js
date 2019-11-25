const express = require("express");
const router = express.Router();
const passport = require("passport");
const SpotifyApi = require("../lib/spotify-api");
const authController = require("../lib/auth.controller");

require("dotenv").config();

const spotifyApi = new SpotifyApi().getInstance();

const spotifyAuth = passport.authenticate("spotify", {
  scope: ["user-top-read"]
});

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

router.get("/", addSocketIdtoSession, spotifyAuth);

router.get("/auth/login", addSocketIdtoSession, spotifyAuth);

router.get("/auth/callback", spotifyAuth, authController.spotify);

router.get("/api/my-profile", async (req, res) => {
  try {
    const result = await spotifyApi.getMe();
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/api/my-top-artists", async (req, res) => {
  try {
    const options = {
      time_range: req.query.time_range,
      limit: req.query.limit,
      offset: req.query.offset
    };
    const result = await spotifyApi.getMyTopArtists(options);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/api/my-top-tracks", async (req, res) => {
  try {
    const options = {
      time_range: req.query.time_range,
      limit: req.query.limit,
      offset: req.query.offset
    };
    const result = await spotifyApi.getMyTopTracks(options);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/api/track-features", async (req, res) => {
  try {
    const ids = [req.query.ids];
    const result = await spotifyApi.getAudioFeaturesForTracks(ids);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
