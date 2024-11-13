import express from "express";
import YTMusic from "ytmusic-api";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const ytmusic = new YTMusic();
await ytmusic.initialize();

app.get("/search/:type?", async (req, res) => {
  const { type } = req.params;
  const { query = " " } = req.query;
  try {
    if (type === "SONG") {
      const resp = await ytmusic.searchSongs(query);
      return res.send({ data: resp });
    } else if (type === "ALBUM") {
      const resp = await ytmusic.searchAlbums(query);
      return res.send({ data: resp });
    } else if (type === "ARTIST") {
      const resp = await ytmusic.searchArtists(query);
      return res.send({ data: resp });
    } else if (type === "VIDEO") {
      const resp = await ytmusic.searchVideos(query);
      return res.send({ data: resp });
    }

    const resp = await ytmusic.search(query);
    // const resp2 = await ytmusic.searchVideos(query);
    // const resp2 = await ytmusic.searchPlaylists(query);
    // const resp2 = await ytmusic.searchAlbums(query);
    // const resp2 = await ytmusic.searchArtists(query);
    // const resp2 = await ytmusic.getSearchSuggestions(query);
    return res.send({ data: resp });
  } catch (error) {
    return res.send(error);
  }
});

app.get("/", async (req, res) => {
  try {
    const resp = await ytmusic.search(req.query.query);
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
});

app.get("/songs", async (req, res) => {
  try {
    const resp = await ytmusic.searchSongs(req.query.query);
    // const respPlayList = await ytmusic.searchPlaylists(req.query.query);

    res.send({
      data: resp,
      //   playlist: respPlayList,
    });
  } catch (error) {
    res.send(error);
  }
});
app.get("/playlist/:id", async (req, res) => {
  try {
    const respSuggestion = await ytmusic.getPlaylistVideos(req.params.id);

    res.send({
      data: respSuggestion,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/song/:id", async (req, res) => {
  try {
    const resp = await ytmusic.s(req.params.id);
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
});

app.listen(8080, () => console.log("listining on port 8080"));
