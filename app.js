require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  // console.log('req query', req.query.searchArtist)
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((data) => {
      //   console.log('The received data from the API: ', data.body.artists.items);
      const searchArtistsResults = data.body.artists.items[0];
      res.render("artist-search-results", { searchArtistsResults });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albumsFromApi = data.body.items;
      res.render("albums", { albumsFromApi });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
        // console.log('albumIdParams: ', req.params.albumId);
      console.log("tracks retrieved from API: ", data.body.items);
      const tracksFromApi = data.body.items;
      res.render("tracks", { tracksFromApi });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
