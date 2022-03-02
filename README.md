# Cleanify

### What it does:

Cleanify converts your Explicit spotify playlists into Clean spotify playlists so you can listen to your favorite playlists when your parents are around!

### How to run it:

1. Login to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Create a "new app" and record your Client ID and Client Secret
3. Go to "edit settings" within your project and set the Redirect URI to http://localhost:3000/callback and save
4. Clone this github repo or download the zip file. This example saves it to your desktop

```
cd Desktop
git clone https://github.com/code-arman/Cleanify.git
cd Cleanify
```

5. Once you're in the project directory in Terminal, run the following npm command (make sure you already have [Node](https://nodejs.org/en/download/) installed)

```
npm install
```

6. Add your Client ID and Client Secret that you got from your Spotify developer dashboard into terminal by running the following commands. Replace your information wtih YOURCLIENTID and YOURCLIENTSECRET.

![Dashboard](imgs/spotify-developer-dashboard-keys.png)

```
export CLIENT_ID=YOURCLIENTID
export CLIENT_SECRET=YOURCLIENTSECRET
```

7. Run the following commands
   ```
   cd src
   node server.js
   ```
8. Go to `http://localhost:3000/` in your browser (preferably Google Chrome)
9. Login with Spotify and Cleanify your Playlists
10. Your new playlist will show up in your spotify account

### How it works:

Cleanify sends a request to spotify's api for each song in the selected playlist with " clean" appended at the end. Often times, users have created a playlist with the Clean version of that song inside of it, so it shows at the top of the search results. Cleanify then compares each song in this recenetly searched for playlist to the song that the user has in their own playlist, and adds it to a new 'Cleanified' playlist if it is both non-explicit and has the same name. There is no method to ensure all songs in the playlist have a clean version, but using Cleanify gives you the best chance at finding the clean version if it is there, and removes it if it can't find the clean version of the song. This will make it so when you want to listen to your playlist around your parents, the songs will not have swear words :)

## How to use it

<h6>Login Screen</h6>

![Login](imgs/cleanify-login-page.png)

<h6>Cleanify Screen</h6>

![Home](imgs/cleanify-home.png)

### Credit

Project Idea from [here](https://github.com/Divide-By-0/app-ideas-people-would-use)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
