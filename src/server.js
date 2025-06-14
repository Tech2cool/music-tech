import express from "express";
import YTMusic from "ytmusic-api";
import cors from "cors";
import "dotenv/config";

import AppModel from "./appSchema.js";
import db from "./db.js";
db.connectDB();

const app = express();
app.use(express.json());
app.use(cors());
async function getYtMusicClient(clientRegion = "IN", clientLanguage = "en") {
  const ytmusic = new YTMusic();
  await ytmusic.initialize({
    GL: clientRegion, // Defaults to 'IN' if no clientRegion provided
    HL: clientLanguage, // Defaults to 'en'
    //     GL: "IN",
    // HL: "en",
    cookies: "PREF=f1=50000000", // Just an example, you need an actual cookie from India
  });
  return ytmusic;
}

const ytmusic = await getYtMusicClient(); // defaults to IN + en

// const ytmusic = new YTMusic();
// await ytmusic.initialize();

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
    } else if (type === "PLAYLIST") {
      const resp = await ytmusic.searchPlaylists(query);
      return res.send({ data: resp });
    } else if (type === "VIDEO") {
      const resp = await ytmusic.searchVideos(query);
      return res.send({ data: resp });
    }
    const resp = await ytmusic.search(query);
    return res.send({ data: resp });
  } catch (error) {
    return res.send(error);
  }
});

app.get("/", async (req, res) => {
  try {
    res.json({ message: "welcome" });
  } catch (error) {
    res.send(error);
  }
});

app.get("/home", async (req, res) => {
  try {
    const respSuggestion = await ytmusic.getHomeSections();
    const filteredNulls = respSuggestion.filter(
      (ele) => ele.contents.some((cle) => cle !== null) // Keep `ele` only if it has at least one non-null value in `contents`
    );
    res.send({
      data: filteredNulls,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/playlist/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(401).send({ message: "No id Provided" });

    const respSuggestion = await ytmusic.getPlaylistVideos(id);

    res.send({
      data: respSuggestion,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/artist/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(401).send({ message: "No id Provided" });

    const respSuggestion = await ytmusic.getArtist(id);

    res.send({
      data: respSuggestion,
    });
  } catch (error) {
    res.send(error);
  }
});
app.get("/album/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(401).send({ message: "No id Provided" });

    const respSuggestion = await ytmusic.getAlbum(id);

    res.send({
      data: respSuggestion,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/song/:id", async (req, res) => {
  try {
    if (!id) return res.status(401).send({ message: "No id Provided" });
    const resp = await ytmusic.getSong(req.params.id);
    return res.send(resp);
  } catch (error) {
    return res.send(error);
  }
});

app.get("/up-next/:id", async (req, res) => {
  try {
    if (!id) return res.status(401).send({ message: "No id Provided" });
    const resp = await ytmusic.getUpNexts(id);
    return res.send(resp);
  } catch (error) {
    return res.send(error);
  }
});

app.get("/version", async (req, res) => {
  try {
    const existingRecord = await AppModel.findOne({});
    // const existingRecord = await URL.findOne({});
    return res.send({ data: existingRecord });
  } catch (error) {
    return res.send(error);
  }
});

app.listen(8082, "0.0.0.0", () => console.log("listining on port 8082"));
