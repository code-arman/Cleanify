import { Heading, Flex, VStack, Link, Text } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import {
  createPlaylist,
  getTracks,
  getNextTracks,
  getUser,
  deletePlaylist,
  addTracksToPlaylist,
  searchForTrack,
  getPlaylists,
} from "../utils/api.js";
import {
  Button,
  SimpleGrid,
  Container,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import PlaylistTable from "../components/PlaylistTable.jsx";
import SongTable from "../components/SongTable.jsx";
import AuthContext from "../contexts/SpotifyAuthContext.jsx";
import CleanSongTable from "../components/CleanSongTable.jsx";
import { SummaryModal } from "../components/SummaryModal.jsx";

const Home = () => {
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cleanifySummary, setCleanifySummary] = useState();
  const toast = useToast();
  const {
    checkedPlaylist,
    playlists,
    tracks,
    setPlaylists,
    setTracks,
    cleanedPlaylistID,
    setCleanedPlaylistID,
  } = useContext(AuthContext);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUser();
      setUser(u);
    };
    loadUser();
  }, []);

  const handleDelete = async () => {
    await deletePlaylist(playlists.items[checkedPlaylist].id);

    setPlaylists(await getPlaylists());
    toast({
      title: `Deleted Playlist named "${playlists.items[checkedPlaylist].name}"`,
      position: "top-right",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCleanify = async () => {
    toast({
      title: `Cleanifying Playlist...`,
      position: "top-right",
      status: "info",
      duration: 20000,
      isClosable: true,
    });

    const allTracks = [];
    let tracks = await getTracks(playlists.items[checkedPlaylist].id);
    allTracks.push(...tracks.items);
    while (tracks.next) {
      tracks = await getNextTracks(tracks.next);
      allTracks.push(...tracks.items);
    }
    tracks = { items: allTracks };

    setTracks(tracks);
    console.log("final", tracks);

    const cleanTrackIDs = [];
    const explicitTrackNames = [];

    for (let t of tracks.items) {
      t.track.explicit
        ? explicitTrackNames.push(`${t.track.name} Clean`)
        : cleanTrackIDs.push(`spotify:track:${t.track.id}`);
    }

    const cleanVersionTrackIDs = [];
    const cleanVersionNames = [];

    for (let track of explicitTrackNames) {
      const playlistResponses = await searchForTrack(track);
      if (playlistResponses.playlists.items.length > 0) {
        const playlistWithCleanSong = playlistResponses.playlists;
        const firstPlaylistID = playlistWithCleanSong.items[0].id;
        const cleanTracks = await getTracks(firstPlaylistID);
        if (cleanTracks) {
          for (let t of cleanTracks.items) {
            if (
              t &&
              t.track &&
              !t.track.explicit &&
              t.track.name === track.slice(0, -6)
            ) {
              cleanVersionTrackIDs.push(`spotify:track:${t.track.id}`);
              cleanVersionNames.push(t.track.name);
            }
          }
        }
      }
    }
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

    setCleanifySummary({
      numOriginalClean: cleanTrackIDs.length,
      numCleanFound: cleanVersionTrackIDs.length,
      cleanFound: cleanVersionNames,
    });
    toast.closeAll();

    setCleanedPlaylistID(newPlaylist.id);

    toast({
      title: "Sucessfully Cleanified Playlist",
      position: "top-right",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex align="center" justify="center" p={[0, 1, 15, 20]}>
      <VStack>
        {user && <Heading>Cleanify</Heading>}
        {user && <Text fontSize="lg">{`Username: ${user.display_name}`}</Text>}
        {!user && (
          <>
            <Heading fontSize="xl">{`You need to login into spotify! `}</Heading>
            <Link href="/">Click here to go to the login page</Link>
          </>
        )}

        {user && (
          <SimpleGrid spacing={[1, 3, 5, 5]} columns={[1, 1, 3, 3]}>
            <Button colorScheme="green" onClick={handleCleanify}>
              Cleanify Playlist
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete Playlist
            </Button>
            <Button isDisabled={!cleanedPlaylistID} onClick={onOpen}>
              View Summary
            </Button>
          </SimpleGrid>
        )}
        {cleanifySummary && (
          <SummaryModal
            isOpen={isOpen}
            onClose={onClose}
            details={cleanifySummary}
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
            {tracks && (
              <SongTable
                title={`Before Cleanified (${tracks.items.length} songs)`}
              />
            )}
          </Container>
          <Container
            mt={[0, 1, 1, 1]}
            mb={[20, 1, 1, 1]}
            h="700px"
            width={["200px", "300px", "400px"]}
          >
            {cleanedPlaylistID && (
              <CleanSongTable
                title={`After Cleanified (${
                  cleanifySummary.numCleanFound +
                  cleanifySummary.numOriginalClean
                } songs)`}
              />
            )}
          </Container>
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};

export default Home;
