import { createContext, useContext, useState } from "react";

const GlobalContext = createContext("");

const GlobalContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [checkedPlaylist, setCheckedPlaylist] = useState();
  const [playlists, setPlaylists] = useState();
  const [tracks, setTracks] = useState();
  const [cleanedPlaylistID, setCleanedPlaylistID] = useState();
  const [songsToResolve, setSongsToResolve] = useState([]);

  return (
    <GlobalContext.Provider
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
        songsToResolve,
        setSongsToResolve,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

export const useGlobalState = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalState must be used inside the GlobalContext provider"
    );
  }

  return context;
};
