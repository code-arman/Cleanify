import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';
const BASE_URL = 'https://api.spotify.com/v1/artists';

function ArtistTracks(props) {
  let url = BASE_URL + "/".concat(props.id, "/top-tracks");

  let options = _objectSpread({}, props.options);

  return React.createElement(ApiRequest, {
    url: url,
    options: options
  }, props.children);
}

ArtistTracks.propTypes = {
  options: PropTypes.shape({
    market: PropTypes.string.isRequired
  }),
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};
ArtistTracks.defaultProps = {
  options: {
    market: 'from_token'
  }
};
export default ArtistTracks;