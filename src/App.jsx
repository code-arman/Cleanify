import Login from "./pages/Login";
import Home from "./pages/Home";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./contexts/SpotifyAuthContext";
import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  const [checkedPlaylist, setCheckedPlaylist] = useState();
  const [playlists, setPlaylists] = useState();
  const [tracks, setTracks] = useState();
  const [cleanedPlaylistID, setCleanedPlaylistID] = useState();

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        checkedPlaylist,
        setCheckedPlaylist,
        playlists,
        setPlaylists,
        tracks,
        setTracks,
        cleanedPlaylistID,
        setCleanedPlaylistID,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={"/"} />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fail" element={<h1>login failed</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
