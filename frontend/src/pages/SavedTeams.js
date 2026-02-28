import { useState, useEffect } from "react";

function SavedTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typeColors = {
    fire: "#FF6B35", water: "#4A90D9", grass: "#5DBB63",
    electric: "#F7DC6F", psychic: "#FF69B4", ice: "#AED6F1",
    dragon: "#7B68EE", dark: "#5D4037", fairy: "#FFB7C5",
    fighting: "#C0392B", poison: "#8E44AD", ground: "#D4AC0D",
    flying: "#85C1E9", bug: "#82E0AA", rock: "#AAB7B8",
    ghost: "#6C3483", steel: "#717D7E", normal: "#AAB7B8",
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("https://pokemon-app-production-2be7.up.railway.app/teams");
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError("Saved teams not found. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <main className="main"><p>Loading saved teams...</p></main>;
  if (error) return <main className="main"><p className="error-msg">{error}</p></main>;

  return (
    <main className="main">
      <section className="card">
        <h2 className="card-title">Saved Teams</h2>

        {teams.length === 0 ? (
          <p style={{ color: "var(--text-light)" }}>No teams saved yet!</p>
        ) : (
          <div className="saved-teams-list">
            {teams.map((team) => (
              <div key={team._id} className="saved-team-item">
                <p className="saved-team-name">{team.teamName}</p>
                <p className="saved-team-count">{team.pokemons.length} Pokemon</p>

                <div className="team-grid" style={{ marginTop: "16px" }}>
                  {team.pokemons.map((p, index) => (
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default SavedTeams;