import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';

function TrackFeatures(props) {
  let url = 'https://api.spotify.com/v1/audio-features';
  let options = {};

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

TrackFeatures.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)]).isRequired,
  children: PropTypes.func.isRequired
};
export default TrackFeatures;