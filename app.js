const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000),
  () => {
    console.log('serve has started on port 3000');
  };

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
