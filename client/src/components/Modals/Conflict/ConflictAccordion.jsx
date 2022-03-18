import { MinusIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Link,
  UnorderedList,
  Tooltip,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { useGlobalState } from "../../../contexts/GlobalContext";
import SongListItem from "./SongListItem";

export const ConflictAccordion = ({ mainSong, possibleSongs, allSongs }) => {
  const { setSongsToResolve, songsToResolve } = useGlobalState();

  const handleRemoveItemFromList = () => {
    const remaining = new Map();
    for (let [key, value] of songsToResolve) {
      if (key !== mainSong) remaining.set(key, value);
    }
    setSongsToResolve(remaining);
    // TODO: Update summary view with changes
  };
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Flex flexDir="row" justify="center" align="center">
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Link
                isExternal
                fontSize="xl"
                fontWeight="bold"
                href={possibleSongs[0] && possibleSongs[0].original_track_link}
              >
                {mainSong}
              </Link>
            </Box>

            <AccordionIcon />
          </AccordionButton>
          <Tooltip
            hasArrow
            label="Do not add this song to playlist (None below match)"
            fontSize="md"
          >
            <IconButton
              ml={3}
              minW="25px"
              w="25px"
              h="25px"
              icon={<MinusIcon h={3} w={3} />}
              colorScheme="red"
              onClick={handleRemoveItemFromList}
            >
              -
            </IconButton>
          </Tooltip>
        </Flex>
        <AccordionPanel pb={4}>
          <UnorderedList mb={5}>
            {possibleSongs &&
              possibleSongs.map((item, index) => (
                <SongListItem
                  allSongs={allSongs}
                  key={index}
                  songTitle={item.name}
                  songLink={item.link}
                  songURI={item.uri}
                  ogSongTitle={mainSong}
                />
              ))}
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
export default ConflictAccordion;
