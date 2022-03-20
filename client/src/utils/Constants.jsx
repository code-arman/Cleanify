export const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
];
const RESPONSE_TYPE = "code";
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

export const AUTH_ENDPOINT = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI.slice(
  0,
  -1
)}&scope=${SCOPES.join("%20")}`;
