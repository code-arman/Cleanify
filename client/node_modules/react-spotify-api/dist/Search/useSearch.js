import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import useApiRequest from '../ApiRequest/useApiRequest';

function useSearch(query, options) {
  const url = 'https://api.spotify.com/v1/search';
  const type = [];
  if (options.album) type.push('album');
  if (options.artist) type.push('artist');
  if (options.playlist) type.push('playlist');
  if (options.track) type.push('track');

  const optionsObj = _objectSpread({
    q: query,
    type: type.join(',')
  }, options);

  const _useApiRequest = useApiRequest(url, optionsObj),
        data = _useApiRequest.data,
        loading = _useApiRequest.loading,
        error = _useApiRequest.error;

  return {
    data,
    loading,
    error
  };
}

export default useSearch;