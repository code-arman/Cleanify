const CLIENT_Id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
];
export const REQUEST_INFO = {
  authorizationUrl: SPOTIFY_AUTH_ENDPOINT,
  responseType: "token",
  scope: SCOPES.join(" "),
  clientId: CLIENT_Id,
  redirectUri: `${window.location.href}home`,
};