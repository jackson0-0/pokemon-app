const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection Error:", err));

// pokemon schema
const pokemonSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  types: [String],
  sprite: String,
  moves: [String],
  fetchedAt: { type: Date, default: Date.now },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

// check mongodb first, if not found call pokeapi
async function getPokemon(pokemonName) {
  const dbPokemon = await Pokemon.findOne({ name: pokemonName });

  if (dbPokemon) {
    console.log("found " + pokemonName + " in mongodb");
    return {
      source: "mongodb",
      data: {
        name: dbPokemon.name,
        types: dbPokemon.types,
        sprite: dbPokemon.sprite,
        moves: dbPokemon.moves,
      },
    };
  }

  console.log(pokemonName + " pokemon not in database, fetching pokeapi...");

  const response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon/" + pokemonName,
  );

  const data = response.data;

  const moves = data.moves.slice(0, 4).map((m) => m.move.name);

  const result = {
    name: data.name,
    types: data.types.map((t) => t.type.name),
    sprite: data.sprites.front_default,
    moves: moves,
  };

  await Pokemon.create(result);
  console.log("saved " + pokemonName + " to mongodb");

  return { source: "pokeapi", data: result };
}

app.get("/test", function (req, res) {
  res.json({ message: "Backend is working!" });
});

app.get("/pokemon/:name", async function (req, res) {
  const pokemonName = req.params.name;

  try {
    const { source, data } = await getPokemon(pokemonName);
    res.json({ ...data, source });
  } catch (error) {
    res.status(404).json({ error: "Pokemon not found" });
  }
});

// team schema
const teamSchema = new mongoose.Schema({
  teamName: String,
  pokemons: [
    {
      name: String,
      types: [String],
      sprite: String,
      moves: [String],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", teamSchema);

// save a team
app.post("/teams", async function (req, res) {
  const { teamName, pokemons } = req.body;

  try {
    const newTeam = await Team.create({ teamName, pokemons });
    console.log("saved team: " + teamName);
    res.json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to save team" });
  }
});

// get all saved teams, sorted by recent
app.get("/teams", async function (req, res) {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to get teams" });
  }
});

const PORT = 5001;
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});
