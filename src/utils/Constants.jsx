const CLIENT_Id = "90eb748bb57f4e21a621f6711ab46ee4";
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "user-read-private",
  "user-read-email",
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
  redirectUri: "http://localhost:3000/home",
};
