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
  res.render("index", { title: "Top Spotify Node" });
});

router.get("/login", (req, res) => {
  const html = spotifyApi.createAuthorizeURL(scopes);
  console.log(html);
  res.send(html + "&show_dialog=true");
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  console.log(code);
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect("http://localhost:3001/my-top-artists");
  } catch (err) {
    res.redirect("/#/error/invalid token");
  }
});

router.get("/my-top-artists", async (req, res) => {
  try {
    const options = {
      time_range: req.params.time_range,
      limit: req.params.limit,
      offset: req.params.offset
    }
    const result = await spotifyApi.getMyTopArtists(options);
    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});
