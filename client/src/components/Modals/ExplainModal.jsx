import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export const ExplainModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent p={6}>
        <ModalHeader>FAQ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading mb={2} size={"16px"} as={"h6"}>
            What happens when I press "Cleanify Playlist"?
          </Heading>

          <Text pb={5}>
            {
              "A new playlist is created and all of songs that are already Clean (non-explicit) are added. Then, it searches Spotify for the Clean versions of the explicit songs in your playlists and adds them if they exist. If a song has no clean version, it will not be added."
            }
          </Text>

          <Heading mb={2} size={"16px"} as={"h6"}>
            What happens when I press "Explicitify Playlist"?
          </Heading>

          <Text pb={5}>
            {
              "A new playlist is created and all of songs that are already Explicit are added. Then, it searches Spotify for the Explicit versions of the Clean (non-explicit) songs in your playlists and adds them if they exist. If a song has no explicit version, it will still be added."
            }
          </Text>

          <Heading mb={2} size={"16px"} as={"h6"}>
            I accidentaly deleted a playlist! Can I recover it?
          </Heading>
          <Box>
            <Text pb={5}>
              {`You can recover deleted playlists via Spotify `}
              <Link
                isExternal
                color="teal.500"
                href="https://www.spotify.com/us/account/recover-playlists/"
              >
                here
                <ExternalLinkIcon ml={1} />
              </Link>
            </Text>
          </Box>

          <Heading mb={2} size={"16px"} as={"h6"}>
            How do I report a bug?
          </Heading>
          <Box>
            <Text pb={5}>
              {`You can create a new issue on the Github repository linked `}
              <Link
                isExternal
                color="teal.500"
                href="https://github.com/code-arman/Cleanify/issues"
              >
                here
                <ExternalLinkIcon ml={1} />
              </Link>
            </Text>
          </Box>

          <Heading mb={2} size={"16px"} as={"h6"}>
            How can I support this project?
          </Heading>
          <Box>
            <Text pb={5}>
              {`You can star the Github repository linked `}
              <Link
                isExternal
                color="teal.500"
                href="https://github.com/code-arman/Cleanify"
              >
                here
                <ExternalLinkIcon ml={1} />
              </Link>
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
