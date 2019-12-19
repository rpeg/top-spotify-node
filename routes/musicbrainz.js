const express = require('express');
const axios = require('axios');

const router = express.Router();

require('dotenv').config();

const axiosInstance = axios.create({
  baseURL: process.env.MB_SERVER_URL,
  timeout: 10000,
});

// Fetches artists' countries for artist/release pair objects en masse
router.get('/api/artist-locations', async (req, res) => {
  const artistReleases = JSON.parse(req.query.artistReleases);

  console.log(artistReleases);

  await axiosInstance.get('/api/artist-locations', {
    params: {
      artists: JSON.stringify(artistReleases),
    },
  })
    .then((response) => res.status(200).send(response.data))
    .catch((err) => {
      console.log(err);

      res.status(400).send(err);
    });
});

module.exports = router;
