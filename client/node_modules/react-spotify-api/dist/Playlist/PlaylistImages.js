import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';

function PlaylistImages(props) {
  let url = "https://api.spotify.com/v1/playlists/".concat(props.id, "/images");
  return React.createElement(ApiRequest, {
    url: url
  }, props.children);
}

PlaylistImages.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};
export default PlaylistImages;