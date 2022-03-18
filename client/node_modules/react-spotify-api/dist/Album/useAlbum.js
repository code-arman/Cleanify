import useApiRequest from '../ApiRequest/useApiRequest';

function useAlbum(id) {
  const url = Array.isArray(id) ? "https://api.spotify.com/v1/albums" : "https://api.spotify.com/v1/albums/".concat(id);
  const options = Array.isArray(id) ? {
    ids: id.join(',')
  } : {};

  const _useApiRequest = useApiRequest(url, options),
        data = _useApiRequest.data,
        loading = _useApiRequest.loading,
        error = _useApiRequest.error;

  return {
    data,
    loading,
    error
  };
}

export default useAlbum;