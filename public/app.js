//gets the accessToken from the search bar paramater
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');

getSpotifyUsername();
getPlaylists();

let submit = document.getElementById('submit');
submit.addEventListener('click', createCleanifiedPlaylist, false);

let deleted = document.getElementById('delete');
deleted.addEventListener('click', deletePlaylist, false);

//Get's spotify username of the person whos account you are logged into
function getSpotifyUsername() {
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  })
    .then(res => res.json())
    .then(
      data =>
        (document.getElementById('theUsersName').innerHTML =
          'Signed in as ' + `<strong>${data.display_name}</strong`)
    );
}

//Get's all playlists that the user follows
function getPlaylists() {
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  })
    .then(res => res.json())
    .then(data => {
      let playlistItems = '';
      let count = 0;
      data.items.forEach(function(names) {
        count++;

        playlistItems += `
       
            <ul class="list-group list-group-flush">
              <li class="list-group-item"> <input type = "radio" name="playlistTitles" id="${names.id}" value="${names.name}">  ${names.name}</li>
            </ul>
     
      `;
      });
      document.getElementById('playlistItems').innerHTML = playlistItems;
    });
}

function deletePlaylist() {
  let checkedPlaylistID = getCheckedPlaylistID();
  let checkedPlaylistName = getCheckedPlaylistName();

  fetch(`https://api.spotify.com/v1/playlists/${checkedPlaylistID}/followers`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  })
    .then(res => res.json())
    .then(data => {});
  location.reload();

  alert(`Deleted playlist named: ${checkedPlaylistName}`);
}

function getCheckedPlaylistID() {
  let OGPlaylistID;
  let ele = document.getElementsByName('playlistTitles');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      OGPlaylistID = ele[i].id; //get playlistID of checked playlist

      return OGPlaylistID;
    }
  }
}

function getCheckedPlaylistName() {
  let oldPlaylistName = '';
  let OGPlaylistID;
  let ele = document.getElementsByName('playlistTitles');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      oldPlaylistName = ele[i].value; //get the name of the checked playlist

      return oldPlaylistName;
    }
  }
}

//once the "cleanify playlist button" is pressed, this function
//creates a new playlist based off of the existing playlists name, and
//it displays the tracks of the original playlist and shows which tracks
//are explicit

function createCleanifiedPlaylist() {
  let checkedPlaylistName = getCheckedPlaylistName();
  let checkedPlaylistID = getCheckedPlaylistID();

  let newlyCreatedPlaylistID = '';
  //creates new playlist
  fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    body: JSON.stringify({
      name: checkedPlaylistName + ' (Cleanified)',
      public: false
    }),
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      newlyCreatedPlaylistID = data.id;
      getAndDisplayTracks(checkedPlaylistID, newlyCreatedPlaylistID);
    });
}

function getAndDisplayTracks(checkedPlaylistID, newPlaylistID) {
  //Gets the tracks of the OG Playlist
  fetch(`https://api.spotify.com/v1/playlists/${checkedPlaylistID}/tracks`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      let cleanTracks = [];
      let tracksInPlaylist = ``;
      let totalTracks;
      data.items.forEach(function(names) {
        if (!names.track.explicit) {
          cleanTracks.push('spotify:track:' + names.track.id);
        }
        tracksInPlaylist += `
        <ul class="list-group list-group-flush">
        <li  class="list-group-item" name="trackTitles" trackId="${names.track.id}" explicit="${names.track.explicit}">${names.track.name}</li>
          </ul>

          `;
      });

      document.getElementById('tracksInPlaylist').innerHTML = tracksInPlaylist;
      document.getElementById(
        'numberOfSongsBeforeCleanified'
      ).innerHTML = `(${data.total} total)`;

      addTracksIntoCleanfiedPlaylist(newPlaylistID, cleanTracks);
      findCleanVersionOfSongs(checkedPlaylistID, newPlaylistID);
      getAfterCleanified(newPlaylistID);

      //display "after cleanified"
    });
}

function getAfterCleanified(newPlaylistID) {
  setTimeout(function() {
    fetch(`https://api.spotify.com/v1/playlists/${newPlaylistID}/tracks`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        let cleanTracks = [];
        let tracksInNewPlaylist = ``;
        data.items.forEach(function(names) {
          tracksInNewPlaylist += `
        <ul class="list-group list-group-flush">
        <li  class="list-group-item" name="trackTitles" trackId="${names.track.id}" explicit="${names.track.explicit}">${names.track.name}</li>
          </ul>

          `;
        });

        document.getElementById(
          'tracksInNewPlaylist'
        ).innerHTML = tracksInNewPlaylist;
        document.getElementById(
          'numberOfSongsAfterCleanified'
        ).innerHTML = `(${data.total} total)`;
      });
  }, 3000);
}

function addTracksIntoCleanfiedPlaylist(playlistID, cleanTracks) {
  //  `https://api.spotify.com/v1/playlists/5U74wGWvE7pepqLyYSklT1/tracks`,
  fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    method: 'POST',
    body: JSON.stringify({
      uris: cleanTracks
    }),
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {});
}

function findCleanVersionOfSongs(checkedPlaylistID, newPlaylistID) {
  //add all of the explicit songs you want to look for into an array
  fetch(`https://api.spotify.com/v1/playlists/${checkedPlaylistID}/tracks`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      let explicitTracks = [];
      let count = 0;
      data.items.forEach(function(names) {
        if (names.track.explicit) {
          count++;
          explicitTracks.push(`${names.track.name} Clean`);
        }
      });
      for (i = 0; i < explicitTracks.length; i++) {
        searchForSong(explicitTracks[i], newPlaylistID);
      }
    });
}

function searchForSong(songTitle, newPlaylistID) {
  fetch(` https://api.spotify.com/v1/search?q=${songTitle}&type=playlist`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.playlists.items.length > 0) {
        theRandomPlaylistWithCleanSongID = data.playlists.items[0].id;

        getFirstSongInPlaylist(
          theRandomPlaylistWithCleanSongID,
          songTitle,
          newPlaylistID
        );
      }
    });
}

function getFirstSongInPlaylist(playlistID, songTitle, newPlaylistID) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      let cleanTracks = [];

      data.items.forEach(function(names) {
        if (
          !names.track.explicit &&
          names.track.name === songTitle.slice(0, -6)
        ) {
          cleanTracks.push('spotify:track:' + names.track.id);
        }
      });
      addTracksIntoCleanfiedPlaylist(newPlaylistID, cleanTracks);
    });
}
