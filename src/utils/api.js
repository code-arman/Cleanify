import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("api-key");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.error === "Expired access token" &&
      !originalRequest._retry
    ) {
      const token = localStorage.getItem("api-key");

      if (token) {
        originalRequest._retry = true;

        // const newToken = await refreshUserToken(token.refresh_token);
        // authStore.setToken(newToken, token.rememberMe);

        return instance(originalRequest);
      }
    }

    throw error;
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

export const searchForTrack = (trackName) =>
  handleResponse(
    instance.get(
      `https://api.spotify.com/v1/search?q=${trackName}&type=playlist`
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
        throw new APIError({ ...error, message });
      } else {
        throw error;
      }
    });
