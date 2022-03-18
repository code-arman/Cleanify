import axios from "axios";

const instance = axios.create();
const wait = (next_retry_time) =>
  new Promise((res) => setTimeout(res, next_retry_time * 1000));

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("api-key");
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response.status === 429) {
      const next_retry_time = error.response.headers["retry-after"];
      console.log("Rate limited, retry after", next_retry_time);
      if (next_retry_time) {
        wait(next_retry_time);
        return instance.request(error.config);
      }
    }

    console.log("API ERROR", error);
    Promise.reject(error);
  }
);

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

export const searchForTracks = (trackName) => {
  return handleResponse(
    instance.get(`https://api.spotify.com/v1/search?q=${trackName}&type=track`)
  );
};

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
