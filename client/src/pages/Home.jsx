import { Flex, VStack, Center } from "@chakra-ui/layout";
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
  Box,
  Heading,
} from "@chakra-ui/react";
import PlaylistTable from "../components/Tables/PlaylistTable.jsx";
import SongTable from "../components/Tables/SongTable.jsx";
import { useGlobalState } from "../contexts/GlobalContext.jsx";
import CleanSongTable from "../components/Tables/CleanSongTable.jsx";
import { SummaryModal } from "../components/Modals/SummaryModal.jsx";
import useAuth from "../hooks/useAuth.jsx";
import SpotifyWebApi from "spotify-web-api-node";
import { ConflictModal } from "../components/Modals/Conflict/ConflictModal.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { CLIENT_ID } from "../utils/Constants.jsx";
import Header from "../components/Header.jsx";
const fuzzball = require("fuzzball");

export const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
});

const Home = ({ code }) => {
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useAuth(code);
  const [user, setUser] = useState();
  const { setToken, setCheckedPlaylist, songsToResolve, setSongsToResolve } =
    useGlobalState();
  const [cleanifyStatus, setCleanifyStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [cleanifyProgress, setCleanifyProgress] = useState(false);
  const [gettingTracks, setGettingTracks] = useState(false);
  const [wantedExplicit, setWantedExplicit] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    setToken(accessToken);
    localStorage.setItem("api-key", accessToken);
    setIsLoading(false);
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
      try {
        setUser(await getUser());
      } catch (e) {
        toast({
          title: `Unable to perform action. Please try refreshing the page and log in again`,
          position: "top",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
    };
    if (accessToken) {
      loadUser();
    }
  }, [accessToken, toast]);

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
        position: "top",
        status: "error",
        duration: 7000,
        isClosable: true,
      });

      return;
    }
    setPlaylists(refreshedPlaylists);
    setDeleteStatus(false);
  };

  const negate = (condition, shouldNegate) => {
    return shouldNegate ? condition : !condition;
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
    setGettingTracks(true);
    setTracks({ items: [] });

    const allTracks = [];
    let tracks = await getTracks(playlists.items[checkedPlaylist].id);
    if (tracks instanceof Error) {
      toast({
        title: `Unable to perform action. Please try refreshing the page and log in again`,
        position: "top",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    if (!tracks) {
      toast({
        title: `Error fetching all tracks. Refresh and try again`,
        position: "top",
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
          position: "top",
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
    setGettingTracks(false);
    return allTracks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedPlaylist, setTracks, toast]);

  useEffect(() => {
    if (checkedPlaylist && checkedPlaylist >= 0) {
      getAllTracks();
    }
  }, [checkedPlaylist, getAllTracks]);

  const handleCleanify = async (shouldExplicitify) => {
    try {
      setCleanifyStatus(true);
      setWantedExplicit(shouldExplicitify);

      const cleanTrackIDs = [];
      const explicitTracks = [];

      for (let t of tracks.items) {
        if (!t.track) continue;
        t && t.track && negate(t.track.explicit, shouldExplicitify)
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
            position: "top",
            status: "error",
            duration: 7000,
            isClosable: true,
          });
        }
        if (trackResponses instanceof Error) {
          toast({
            title: `Error while converting. Your playlist may be too big. Refresh and try again`,
            position: "top",
            status: "error",
            duration: 7000,
            isClosable: true,
          });
          setCleanifyStatus(false);
          return;
        }
        let isClean = false;
        if (trackResponses && trackResponses.tracks.items.length > 0) {
          for (let t of trackResponses.tracks.items) {
            if (
              t &&
              t.name &&
              negate(!t.explicit, shouldExplicitify) &&
              containSameArtists(t, track)
            ) {
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
        `${playlists.items[checkedPlaylist].name} (All ${
          shouldExplicitify ? "Clean" : "Explicit"
        })`,
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
      setCheckedPlaylist(String(Number(checkedPlaylist) + 1));
      setCleanedPlaylistID(newPlaylist.id);
      setCleanifyStatus(false);
      toast({
        title: `${wantedExplicit ? "Explicitified" : "Cleanified"} Playlist`,
        position: "top",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (e) {
      console.log("Error converting", e);
      toast({
        title: `Error while converting. Your playlist may be too big. Refresh and try again`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return isLoading ? (
    <></>
  ) : (
    <Box>
      <Header username={user && user.display_name} />
      <Flex align="center" justify="center" p={[0, 1, 15, 15]}>
        <VStack mb={5}>
          {user && <Heading size={"sm"}>Select a Playlist to Convert</Heading>}
          {user && (
            <SimpleGrid spacing={[1, 3, 5, 5]} columns={[1, 2, 3, 3]}>
              <Button
                isLoading={cleanifyStatus && wantedExplicit}
                bgColor={"#36b864"}
                _hover={{ bgImg: "linear-gradient(rgba(0, 0, 0, 0.4) 0 0)" }}
                color="white"
                onClick={() => handleCleanify(true)}
                loadingText="Cleanifying"
                isDisabled={!checkedPlaylist || gettingTracks}
              >
                Cleanify Playlist
              </Button>
              <Button
                isLoading={cleanifyStatus && !wantedExplicit}
                bgColor={"teal.700"}
                _hover={{ bgImg: "linear-gradient(rgba(0, 0, 0, 0.4) 0 0)" }}
                color="white"
                onClick={() => handleCleanify(false)}
                loadingText="Explicitifying"
                isDisabled={!checkedPlaylist || gettingTracks}
              >
                Explicitify Playlist
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={deleteStatus}
                loadingText="Deleting"
                isDisabled={!checkedPlaylist || cleanifyStatus || gettingTracks}
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
              type={wantedExplicit ? "clean" : "explicit"}
              notType={!wantedExplicit ? "clean" : "explicit"}
            />
          )}
          {songsToResolve && (
            <ConflictModal
              isOpen={isResolveOpen}
              onClose={onResolveClose}
              details={songsToResolve}
              type={!wantedExplicit ? "explicit" : "clean"}
              notType={wantedExplicit ? "explicit" : "clean"}
            />
          )}
          <SimpleGrid
            pt={7}
            columns={[1, 1, 1, 3]}
            alignItems="center"
            spacing={5}
          >
            <Container
              mt={[1, 1, 1, 1]}
              mb={[20, 1, 1, 1]}
              h="700px"
              width={["300px", "300px", "350px"]}
            >
              {user && <PlaylistTable />}
            </Container>
            {checkedPlaylist && (
              <Container
                mt={[1, 1, 1, 1]}
                mb={[20, 1, 1, 1]}
                h="700px"
                width={["300px", "300px", "350px"]}
              >
                {checkedPlaylist && (
                  <SongTable
                    title={`Before ${
                      tracks ? `(${tracks.items.length} songs)` : ""
                    }`}
                  />
                )}
              </Container>
            )}
            {((checkedPlaylist && cleanifyProgress) ||
              (checkedPlaylist && cleanedPlaylistID)) && (
              <Container
                mt={[1, 1, 1, 1]}
                mb={[20, 1, 1, 1]}
                h="700px"
                width={["300px", "300px", "350px"]}
              >
                {checkedPlaylist && cleanedPlaylistID ? (
                  <CleanSongTable
                    title={`After (${
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
            )}
          </SimpleGrid>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Home;
