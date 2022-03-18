import useApiRequest from '../ApiRequest/useApiRequest';

function useUser(id) {
  const url = id ? "https://api.spotify.com/v1/users/".concat(id) : 'https://api.spotify.com/v1/me';

  const _useApiRequest = useApiRequest(url),
        data = _useApiRequest.data,
        loading = _useApiRequest.loading,
        error = _useApiRequest.error;

  return {
    data,
    loading,
    error
  };
}

export default useUser;