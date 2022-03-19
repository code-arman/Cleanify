import axios from "axios";

const instance = axios.create();
const wait = (next_retry_time) =>
  new Promise((res) => setTimeout(res, next_retry_time * 1000));

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("api-key");
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "http://localhost:3000/",
      "Access-Control-Allow-Headers": "Origin",
      "Access-Control-Max-Age": 60,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    config.maxBodyLength = Infinity;
    config.maxContentLength = Infinity;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 429) {
      const next_retry_time = error.response.headers["retry-after"];
      console.log("Rate limited, retry after", next_retry_time);
      if (next_retry_time) {
        wait(next_retry_time);
        return instance.request(error.config);
      }
    } else if (error.response.status === 404) {
      originalRequest._retry = true;
      return instance(originalRequest);
    }

    console.log("API ERROR", error);
  }
);

export default instance;

export const getUser = () =>
  handleResponse(instance.get("https://api.spotify.com/v1/me"));

export const getPlaylists = () =>
  handleResponse(instance.get("https://api.spotify.com/v1/me/playlists"));

export const getTracks = (playlistID) =>
  handleResponse(
    instance.get(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`)
  );

export const getNextTracks = (next) => handleResponse(instance.get(next));

export const createPlaylist = (playlistName, userId) =>
  handleResponse(
    instance.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      name: playlistName,
      public: false,
    })
  );

export const deletePlaylist = (playlistID) =>
  handleResponse(
    instance.delete(
      `https://api.spotify.com/v1/playlists/${playlistID}/followers`
    )
  );

export const addTracksToPlaylist = (playlistID, trackIDs) =>
  handleResponse(
    instance.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      uris: trackIDs,
    })
  );

export const searchForTracks = (trackName) =>
  handleResponse(
    instance.get(
      `https://api.spotify.com/v1/search?q=${encodeURI(trackName)}&type=track`
    )
  );
class APIError extends Error {
  name = "APIError";
}

const handleResponse = (request) =>
  request
    .then((res) => {
      return res;
    })
    .catch((error) => {
      const message = error.response?.data.error;
      if (message) {
        console.error("APIError:", message, error);
        if (message === "Invalid access token") {
          localStorage.removeItem("api-key");
        }
        return new APIError({ ...error, message });
      } else {
        return error;
      }
    });
