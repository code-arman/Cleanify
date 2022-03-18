import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  ListItem,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useGlobalState } from "../../../contexts/GlobalContext";
import { addTracksToPlaylist } from "../../../utils/api";
const SongListItem = ({
  allSongs,
  songTitle,
  songLink,
  songURI,
  ogSongTitle,
}) => {
  const { cleanedPlaylistID, setSongsToResolve, songsToResolve } =
    useGlobalState();
  const toast = useToast();

  const handleAddToPlaylist = async (songURI) => {
    const response = await addTracksToPlaylist(cleanedPlaylistID, [songURI]);

    if (response instanceof Error) {
      toast({
        title: `Error adding song to playlist`,
        position: "top-right",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }
    toast({
      title: `Added song to playlist"`,
      position: "top-right",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    handleRemoveItemFromList();
  };

  const handleRemoveItemFromList = () => {
    const remaining = new Map();
    for (let [key, value] of songsToResolve) {
      if (key !== ogSongTitle) remaining.set(key, value);
    }
    setSongsToResolve(remaining);
    // TODO: Update summary view
  };

  return (
    <ListItem>
      <Flex direction="col">
        <Text>{songTitle}</Text>
        <Box minW="40px" ml="auto" mr={0} mb={2}>
          <Tooltip hasArrow label="Add song to playlist" fontSize="md">
            <IconButton
              ml={3}
              minW="25px"
              w="25px"
              h="25px"
              icon={<AddIcon h={3} w={3} />}
              colorScheme="green"
              onClick={() => handleAddToPlaylist(songURI)}
            >
              +
            </IconButton>
          </Tooltip>

          <Tooltip hasArrow label="View song in Spotify" fontSize="md">
            <Link isExternal href={songLink}>
              <IconButton
                ml={3}
                minW="25px"
                w="25px"
                h="25px"
                colorScheme="teal"
                icon={<ExternalLinkIcon h={3} w={3} />}
              />
            </Link>
          </Tooltip>
        </Box>
      </Flex>
    </ListItem>
  );
};

export default SongListItem;
