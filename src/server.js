import express from "express";
import YTMusic from "ytmusic-api";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const ytmusic = new YTMusic();
await ytmusic.initialize();

app.get("/", async (req, res) => {
  try {
    const resp = await ytmusic.search("Never gonna give you up");
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
