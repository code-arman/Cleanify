import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';

function Search(props) {
  const url = 'https://api.spotify.com/v1/search';

  const options = _objectSpread({}, props.options);

  const type = [];
  if (props.album) type.push('album');
  if (props.artist) type.push('artist');
  if (props.playlist) type.push('playlist');
  if (props.track) type.push('track');
  options.type = type.join(',');
  options.q = props.query;
  return React.createElement(ApiRequest, {
    url: url,
    options: options
  }, props.children);
}

Search.propTypes = {
  query: PropTypes.string.isRequired,
  album: PropTypes.bool,
  artist: PropTypes.bool,
  playlist: PropTypes.bool,
  track: PropTypes.bool,
  options: PropTypes.shape({
    market: PropTypes.string,
    limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    include_external: PropTypes.string
  }),
  children: PropTypes.func.isRequired
};
Search.defaultProps = {
  options: {}
};
export default Search;