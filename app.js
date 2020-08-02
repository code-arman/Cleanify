const express = require('express');
const app = express();
const request = require('request');
const dotenv = require('dotenv');

const my_client_id = process.env.CLIENT_ID; // Your Client ID
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home.htm');
});

app.listen(3000),
  () => {
    console.log('server has started on port 3000');
  };

app.get('/login', function(req, res) {
  var scopes =
    'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative ';
  res.redirect(
    'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(redirect_uri)
  );
});

app.get('/callback', function(req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(my_client_id + ':' + client_secret).toString('base64')
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    let uri = 'http://localhost:3000/home';
    res.redirect(uri + '?access_token=' + access_token);
  });
});
