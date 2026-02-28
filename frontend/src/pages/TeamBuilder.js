import { useState } from "react";

function TeamBuilder() {
  const [searchName, setSearchName] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [team, setTeam] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const typeColors = {
    fire: "#FF6B35",
    water: "#4A90D9",
    grass: "#5DBB63",
    electric: "#F7DC6F",
    psychic: "#FF69B4",
    ice: "#AED6F1",
    dragon: "#7B68EE",
    dark: "#5D4037",
    fairy: "#FFB7C5",
    fighting: "#C0392B",
    poison: "#8E44AD",
    ground: "#D4AC0D",
    flying: "#85C1E9",
    bug: "#82E0AA",
    rock: "#AAB7B8",
    ghost: "#6C3483",
    steel: "#717D7E",
    normal: "#AAB7B8",
  };

  const searchPokemon = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/pokemon/${searchName.toLowerCase()}`,
      );
      if (!response.ok) {
        setError("Pokemon not found");
        setPokemon(null);
        return;
      }
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const addToTeam = () => {
    setError(null);
    if (!pokemon) return;
    if (team.length >= 6) {
      setError("Your team is full");
      return;
    }
    if (team.find((p) => p.name === pokemon.name)) {
      setError(`${pokemon.name} is already in your team`);
      return;
    }
    setTeam([...team, pokemon]);
  };

  const removeFromTeam = (indexToRemove) => {
    setTeam(team.filter((_, index) => index !== indexToRemove));
    setAnalysis(null);
  };

  const analyzeTeam = async () => {
    setError(null);
    if (team.length === 0) {
      setError("Add Pokemon to your team before analyzing");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: team }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError("Couldn't connect to server");
    } finally {
      setLoading(false);
    }
  };

  // save to server
  const saveTeam = async () => {
    setError(null);
    if (team.length === 0) {
      setError("Add Pokemon before saving");
      return;
    }
    if (!teamName.trim()) {
      setError("Enter team name");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, pokemons: team }),
      });
      if (!response.ok) {
        setError("Couldn't save team");
        return;
      }
      setSaveSuccess(true);
      setTeamName("");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError("Could not connect to server");
    }
  };

  return (
    <main className="main">
      {/* Search Section */}
      <section className="card search-card">
        <h2 className="card-title">Search Pokémon</h2>
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="example Pikachu"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPokemon()}
          />
          <button
            className="btn btn-primary"
            onClick={searchPokemon}
            disabled={loading || !searchName}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error-msg">⚠️ {error}</p>}
        {saveSuccess && <p className="success-msg">✅ Team Saved</p>}
      </section>

      {/* Pokemon Result */}
      {pokemon && (
        <section className="card pokemon-card">
          <img
            className="pokemon-sprite"
            src={pokemon.sprite}
            alt={pokemon.name}
          />
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <div className="type-badges">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="type-badge"
                style={{ backgroundColor: typeColors[type] || "#aaa" }}
              >
                {type}
              </span>
            ))}
          </div>
          {pokemon.moves && (
            <div className="moves-section">
              <p className="moves-title">Moves</p>
              <div className="moves-list">
                {pokemon.moves.map((move) => (
                  <span key={move} className="move-badge">
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button className="btn btn-success" onClick={addToTeam}>
            + Add to Team
          </button>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section className="card team-card">
          <h2 className="card-title">
            Your Team <span className="team-count">{team.length} / 6</span>
          </h2>
          <div className="team-grid">
            {team.map((p, index) => (
              <div key={index} className="team-member">
                <img src={p.sprite} alt={p.name} className="team-sprite" />
                <p className="team-name">{p.name}</p>
                <div className="type-badges small">
                  {p.types.map((type) => (
                    <span
                      key={type}
                      className="type-badge small"
                      style={{ backgroundColor: typeColors[type] || "#aaa" }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-remove"
                  onClick={() => removeFromTeam(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Save Team */}
          <div className="save-team-row">
            <input
              className="search-input"
              type="text"
              placeholder="Give your team a name..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button className="btn btn-save" onClick={saveTeam}>
              Save Team
            </button>
          </div>

          <button className="btn btn-primary analyze-btn" onClick={analyzeTeam}>
            Analyze Team
          </button>
        </section>
      )}

      {/* Analysis */}
      {analysis && (
        <section className="card analysis-card">
          <h2 className="card-title">Team Analysis</h2>
          <div className="analysis-section">
            <h3>Effective Against</h3>
            <div className="type-badges">
              {analysis.coverage_against.map((type) => (
                <span
                  key={type}
                  className="type-badge"
                  style={{ backgroundColor: typeColors[type] || "#aaa" }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="analysis-section">
            <h3>Weaknesses</h3>
            <div className="weakness-grid">
              {Object.entries(analysis.weakness_summary).map(
                ([type, count]) => (
                  <div key={type} className="weakness-item">
                    <span
                      className="type-badge"
                      style={{ backgroundColor: typeColors[type] || "#aaa" }}
                    >
                      {type}
                    </span>
                    <span className="weakness-count">{count} weak</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default TeamBuilder;
