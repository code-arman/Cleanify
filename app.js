const express = require('express');
const app = express();
var queryString = require('query-string');
var cookieParser = require('cookie-parser');
let request = require('request');

const my_client_id = '90eb748bb57f4e21a621f6711ab46ee4';
var client_secret = 'b1698dba49134a168c168739fdf31b08'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Or Your redirect uri

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
    'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
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

//post request to:   https://accounts.spotify.com/api/token

// const fetchNextPlanets = (url = 'http://swapi.dev/api/planets') => {
//   return axios.get(url);
// };

// const printPlanets = ({ data }) => {
//   console.log(data);
//   for (let planet of data.results) {
//     console.log(planet.name);
//   }
//   return Promise.resolve(data.next);
// };

// fetchNextPlanets()
//   .then(printPlanets)
//   .then(fetchNextPlanets)
//   .then(printPlanets)
//   .then(fetchNextPlanets)
//   .then(printPlanets)

//   .catch(err => {
//     console.log('ERRR', err);
//   });

// async function getPlanets() {
//   const res = await axios.get('http://swapi.dev/api/planets');
//   console.log(res.data);
// }

// async function get3Pokemon() {
//     const prom1 = axios.get('https://pokeapi.co/api/v2/pokemon/1');
//     const prom2 = axios.get('https://pokeapi.co/api/v2/pokemon/2');
//     const prom3 = axios.get('https://pokeapi.co/api/v2/pokemon/3');
//     const results = await Promise.all([prom1, prom2, prom3]);
//     printPokemon(results);
//   }
//   function printPokemon(results) {
//     for (let pokemon of results) {
//       console.log(pokemon.data.name);
//     }
//   }
//   get3Pokemon();

//   function changeBodyColor(color, delay) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         document.body.style.backgroundColor = color;
//         resolve();
//       }, delay);
//     });
//   }

// async function lightShow() {
//   await changeBodyColor('teal', 1000);
//   await changeBodyColor('pink', 1000);
//   await changeBodyColor('red', 1000);
//   await changeBodyColor('blue', 1000);
// }
// lightShow();

// async function lightShow() {
//   const p1 = changeBodyColor('teal', 1000);
//   const p2 = changeBodyColor('pink', 1000);
//   const p3 = changeBodyColor('red', 1000);
//   const p4 = changeBodyColor('blue', 1000);
//   await p1;
//   await p2;
//   await p3;
//   await p4;
// }
// lightShow();
