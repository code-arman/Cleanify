import { Heading, Flex, VStack, Text, Center } from "@chakra-ui/layout";
import { useCallback, useEffect, useState } from "react";
import {
  createPlaylist,
  getTracks,
  getNextTracks,
  getUser,
  deletePlaylist,
  addTracksToPlaylist,
  getPlaylists,
  searchForTracks,
} from "../utils/api.js";
import {
  Button,
  SimpleGrid,
  Container,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import PlaylistTable from "../components/Tables/PlaylistTable.jsx";
import SongTable from "../components/Tables/SongTable.jsx";
import { useGlobalState } from "../contexts/GlobalContext.jsx";
import CleanSongTable from "../components/Tables/CleanSongTable.jsx";
import { SummaryModal } from "../components/Modals/SummaryModal.jsx";
import Failed from "./Failed.jsx";
import useAuth from "../hooks/useAuth.jsx";
import SpotifyWebApi from "spotify-web-api-node";
import { ConflictModal } from "../components/Modals/Conflict/ConflictModal.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { CLIENT_ID } from "../utils/Constants.jsx";
const fuzzball = require("fuzzball");

export const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
});

const Home = ({ code }) => {
  console.log("code from url", code);
  const accessToken = useAuth(code);
  const [user, setUser] = useState();
  const { setToken, setCheckedPlaylist, songsToResolve, setSongsToResolve } =
    useGlobalState();
  const [cleanifyStatus, setCleanifyStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [cleanifyProgress, setCleanifyProgress] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    setToken(accessToken);
    spotifyApi.setAccessToken(accessToken);
    localStorage.setItem("api-key", accessToken);
  }, [accessToken, setToken]);

  const {
    isOpen: isSummaryOpen,
    onOpen: onSummaryOpen,
    onClose: onSummaryClose,
  } = useDisclosure();

  const {
    isOpen: isResolveOpen,
    onOpen: onResolveOpen,
    onClose: onResolveClose,
  } = useDisclosure();
  const [isCleanifyLoading, setisCleanifyLoading] = useState();

  const toast = useToast();

  const {
    checkedPlaylist,
    playlists,
    tracks,
    setPlaylists,
    setTracks,
    cleanedPlaylistID,
    setCleanedPlaylistID,
  } = useGlobalState();

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser());
    };
    loadUser();
  }, []);

  const handleDelete = async () => {
    setDeleteStatus(true);
    setCheckedPlaylist(
      String(Number(checkedPlaylist) - 1) >= 0
        ? String(Number(checkedPlaylist) - 1)
        : ""
    );

    await deletePlaylist(playlists.items[checkedPlaylist].id);
    const refreshedPlaylists = await getPlaylists();
    if (refreshedPlaylists instanceof Error) {
      toast({
        title: `Unable to perform action. Please try refreshing the page and log in again`,
        position: "top-right",
        status: "error",
        duration: 7000,
        isClosable: true,
      });

      return;
    }
    setPlaylists(refreshedPlaylists);
    setDeleteStatus(false);
  };

  const containSameArtists = (first, second) => {
    if (first.artists.length !== second.artists.length) return false;
    let artistCount = first.artists.length;
    for (let index = 0; index < artistCount; index++) {
      if (first.artists[index].name !== second.artists[index].name) {
        return false;
      }
    }
    return true;
  };

  const getAllTracks = useCallback(async () => {
    setTracks({ items: [] });

    const allTracks = [];
    let tracks = await getTracks(playlists.items[checkedPlaylist].id);
    if (tracks instanceof Error) {
      toast({
        title: `Unable to perform action. Please try refreshing the page and log in again`,
        position: "top-right",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    if (!tracks) {
      toast({
        title: `Error fetching all tracks. Refresh and try again`,
        position: "top-right",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    }
    allTracks.push(...tracks.items);
    while (tracks && tracks.next) {
      tracks = await getNextTracks(tracks.next);
      if (!tracks) {
        toast({
          title: `Error fetching all tracks. Refresh and try again`,
          position: "top-right",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
      if (tracks && tracks.items) {
        allTracks.push(...tracks.items);
      }
    }
    tracks = { items: allTracks };

    setTracks(tracks);
    return allTracks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedPlaylist, setTracks, toast]);

  useEffect(() => {
    if (checkedPlaylist && checkedPlaylist >= 0) {
      getAllTracks();
    }
  }, [checkedPlaylist, getAllTracks]);

  const handleCleanify = async () => {
    setCleanifyStatus(true);

    await getAllTracks();

    const cleanTrackIDs = [];
    const explicitTracks = [];

    for (let t of tracks.items) {
      if (!t.track) continue;
      t && t.track && t.track.explicit
        ? explicitTracks.push({
            query: `${t.track.name} ${t.track.artists[0].name}`,
            name: t.track.name,
            artists: t.track.artists,
            uri: t.track.uri,
            link: t.track.external_urls.spotify,
          })
        : cleanTrackIDs.push(t.track.uri);
    }

    const cleanVersionTrackIDs = [];
    const remainingExplicitSongs = [];
    const potentiallyCleanSongs = new Map();

    const total = explicitTracks.length;
    let index = 0;
    for (let track of explicitTracks) {
      index++;
      if (track.query.length === 0) continue;
      const trackResponses = await searchForTracks(
        track.query.trim().replaceAll("#", "")
      );
      if (!trackResponses) {
        toast({
          title: `Error searching for track. Refresh and try again`,
          position: "top-right",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
      if (trackResponses instanceof Error) {
        toast({
          title: `Unable to perform action. Please try refreshing the page and log in again`,
          position: "top-right",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
        return;
      }
      let isClean = false;
      if (trackResponses && trackResponses.tracks.items.length > 0) {
        for (let t of trackResponses.tracks.items) {
          if (t && t.name && !t.explicit && containSameArtists(t, track)) {
            if (fuzzball.distance(t.name, track.name) === 0) {
              cleanVersionTrackIDs.push(t.uri);
              isClean = true;
              break;
            } else if (fuzzball.ratio(t.name, track.name) > 1) {
              if (potentiallyCleanSongs.has(track.name)) {
                potentiallyCleanSongs.get(track.name).push({
                  name: t.name,
                  link: t.external_urls.spotify,
                  uri: t.uri,
                  original_track_uri: track.uri,
                  original_track_link: track.link,
                });
              } else {
                potentiallyCleanSongs.set(track.name, [
                  {
                    name: t.name,
                    link: t.external_urls.spotify,
                    uri: t.uri,
                    original_track_uri: track.uri,
                    original_track_link: track.link,
                  },
                ]);
              }
            }
          }
        }
        if (!isClean) {
          remainingExplicitSongs.push({
            name: track.name,
            queryURL: `https://open.spotify.com/search/${encodeURIComponent(
              track.query
            )}`,
          });
        }
      }
      setCleanifyProgress((index / total) * 100);
    }

    setSongsToResolve(potentiallyCleanSongs);

    const newPlaylist = await createPlaylist(
      `${playlists.items[checkedPlaylist].name} (Cleanified)`,
      user.id
    );
    setPlaylists(await getPlaylists());

    let allCleanSongs = [...cleanTrackIDs, ...cleanVersionTrackIDs];
    let remainingSongs = [];

    while (allCleanSongs.length > 0) {
      remainingSongs = allCleanSongs.splice(0, 100);
      if (remainingSongs.length > 0) {
        await addTracksToPlaylist(newPlaylist.id, remainingSongs);
      }
    }

    setisCleanifyLoading({
      numOriginalClean: cleanTrackIDs.length,
      numCleanFound: cleanVersionTrackIDs.length,
      numStillMissing: remainingExplicitSongs,
    });

    setCleanedPlaylistID(newPlaylist.id);
    setCleanifyStatus(false);
  };

  return (
    <Flex align="center" justify="center" p={[0, 1, 15, 15]}>
      <VStack>
        <Heading>Cleanify</Heading>

        {user && <Text fontSize="lg">{`Username: ${user.display_name}`}</Text>}
        {!user && (
          <>
            <Failed />
          </>
        )}

        {user && (
          <SimpleGrid spacing={[1, 3, 5, 5]} columns={[1, 1, 2, 2]}>
            <Button
              isLoading={cleanifyStatus}
              colorScheme="green"
              onClick={handleCleanify}
              loadingText="Cleanifying"
              isDisabled={!checkedPlaylist}
            >
              Cleanify Playlist
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={deleteStatus}
              loadingText="Deleting"
              isDisabled={!checkedPlaylist}
            >
              Delete Playlist
            </Button>
            {cleanedPlaylistID && (
              <Button isDisabled={!cleanedPlaylistID} onClick={onSummaryOpen}>
                View Summary
              </Button>
            )}
            {cleanedPlaylistID && songsToResolve.size !== 0 && (
              <Button
                isDisabled={songsToResolve.size === 0}
                colorScheme="yellow"
                onClick={onResolveOpen}
              >
                Resolve Conflicts
              </Button>
            )}
          </SimpleGrid>
        )}
        {isCleanifyLoading && (
          <SummaryModal
            isOpen={isSummaryOpen}
            onClose={onSummaryClose}
            details={isCleanifyLoading}
          />
        )}
        {songsToResolve && (
          <ConflictModal
            isOpen={isResolveOpen}
            onClose={onResolveClose}
            details={songsToResolve}
          />
        )}
        <SimpleGrid columns={[1, 1, 1, 3]} alignItems="center" spacing={5}>
          <Container
            mt={[20, 1, 1, 1]}
            mb={[20, 1, 1, 1]}
            h="700px"
            width={["200px", "300px", "400px"]}
          >
            {user && <PlaylistTable />}
          </Container>
          <Container
            mt={["150px", 1, 1, 1]}
            mb={[20, 1, 1, 1]}
            h="700px"
            width={["200px", "300px", "400px"]}
          >
            {checkedPlaylist && (
              <SongTable
                title={`Before Cleanified ${
                  tracks ? `(${tracks.items.length} songs)` : ""
                }`}
              />
            )}
          </Container>
          <Container
            mt={[0, 1, 1, 1]}
            mb={[20, 1, 1, 1]}
            h="700px"
            width={["200px", "300px", "400px"]}
          >
            {checkedPlaylist && cleanedPlaylistID ? (
              <CleanSongTable
                title={`After Cleanified (${
                  isCleanifyLoading.numCleanFound +
                  isCleanifyLoading.numOriginalClean
                } songs)`}
              />
            ) : (
              cleanifyProgress &&
              cleanifyProgress !== 100 && (
                <Center h="700px" flexDir="column">
                  <ProgressBar value={cleanifyProgress} />
                </Center>
              )
            )}
          </Container>
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};

export default Home;
