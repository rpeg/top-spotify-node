const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

const scopes = ["user-top-read"];

require("dotenv").config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL
});

router.get("/", function(req, res, next) {
  res.json({ title: "Top Spotify Node" });
});

router.get("/login", (req, res) => {
  const authUrl = spotifyApi.createAuthorizeURL(scopes);
  console.log(authUrl);
  res.send(authUrl + "&show_dialog=true");
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  console.log(code);
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect(`http://localhost:3001/?login=1`);
  } catch (err) {
    res.redirect("/#/error/invalid token");
  }
});

router.get("/track-features", async (req, res) => {
  try {
    const ids = [req.query.ids];
    const result = await spotifyApi.getAudioFeaturesForTracks(ids);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/my-top-artists", async (req, res) => {
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

router.get("/my-top-tracks", async (req, res) => {
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

router.get("/my-profile", async (req, res) => {
  try {
    const result = await spotifyApi.getMe();
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
