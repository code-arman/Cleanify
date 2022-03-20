# Cleanify

### What it does:

Cleanify converts your Explicit spotify playlists into Clean spotify playlists so you can listen to your favorite playlists where ever you go! You can also convert a playlist to only have explicit songs.

### How it works:

A request is made to Spotify's API to search each song in the playlist. Each search result is checked to see whether or not it is clean and if the names of the both songs are the same. If the potential clean song's name is similar to the original, but not exact, it will be marked as a conflict so the user can manually go through and decide whether or not the potentially clean song is the same as the original.

### How to run locally

1. Create .env file with corresponding env variables from Spotify's developer dashboard
2. Navigate to the client directory and run `yarn && node app.js`
3. Navigate to the server directory and run `yarn && yarn start`
4. Go to http://localhost:3000

#### Credit

Project Idea from [here](https://github.com/Divide-By-0/app-ideas-people-would-use)
