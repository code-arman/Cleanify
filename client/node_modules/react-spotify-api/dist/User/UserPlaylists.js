import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';
const BASE_URL = 'https://api.spotify.com/v1';

function UserPlaylists(props) {
  let url = BASE_URL;

  let options = _objectSpread({}, props.options);

  if (props.id) {
    url += "/users/".concat(props.id, "/playlists");
  } else {
    url += "/me/playlists";
  }

  return React.createElement(ApiRequest, {
    url: url,
    options: options
  }, props.children);
}

UserPlaylists.propTypes = {
  id: PropTypes.string,
  options: PropTypes.shape({
    limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  children: PropTypes.func.isRequired
};
UserPlaylists.defaultProps = {
  options: {}
};
export default UserPlaylists;