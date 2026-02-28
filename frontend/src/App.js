import { Routes, Route } from "react-router-dom";
import TeamBuilder from "./pages/TeamBuilder";
import SavedTeams from "./pages/SavedTeams";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<TeamBuilder />} />
        <Route path="/savedteams" element={<SavedTeams />} />
      </Routes>
    </div>
  );
}

export default App;
