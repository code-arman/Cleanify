import useApiRequest from '../ApiRequest/useApiRequest';
const BASE_URL = 'https://api.spotify.com/v1/artists';

function useArtist(id) {
  const url = Array.isArray(id) ? BASE_URL : BASE_URL + "/".concat(id);
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

export default useArtist;