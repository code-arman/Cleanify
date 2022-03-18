import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';

function Track(props) {
  let url = 'https://api.spotify.com/v1/tracks';

  let options = _objectSpread({}, props.options);

  if (Array.isArray(props.id)) {
    options.ids = props.id.join(',');
  } else {
    url += "/".concat(props.id);
  }

  return React.createElement(ApiRequest, {
    url: url,
    options: options
  }, props.children);
}

Track.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)]).isRequired,
  options: PropTypes.shape({
    market: PropTypes.string
  })
};
Track.defaultProps = {
  options: {}
};
export default Track;