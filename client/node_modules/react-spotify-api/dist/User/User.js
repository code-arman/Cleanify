import React from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../ApiRequest/ApiRequest';

function User(props) {
  let url = 'https://api.spotify.com/v1';
  let options = {};

  if (props.id) {
    url += "/users/".concat(props.id);
  } else {
    url += "/me";
  }

  return React.createElement(ApiRequest, {
    url: url,
    options: options
  }, props.children);
}

User.propTypes = {
  id: PropTypes.string,
  children: PropTypes.func.isRequired
};
export default User;