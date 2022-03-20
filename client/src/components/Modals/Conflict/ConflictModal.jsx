import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import ConflictAccordion from "./ConflictAccordion";

export const ConflictModal = ({ isOpen, onClose, details, type, notType }) => {
  const summary = `Below, there ${
    details.size === 1
      ? `is ${details.size} song that needs to be`
      : `are ${details.size} songs that need to be`
  }  resolved. Often times, the ${type} version of the song's name is not exactly the same as the ${notType} version. The names of the songs below were similar to the ${notType} version, but not exact. It is up to you to chose whether or not one of the suggested songs is actually the ${type} version. Each song title and the potential ${type} versions and linked below. Click on each one to decide whether or not to include them in your playlist.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={6}>
        <ModalHeader>Resolve the following conflicts </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text pb={5}>
            {details.size === 0
              ? "All conflicts have been resolved :)"
              : summary}
          </Text>
          {details && (
            <UnorderedList mt={4}>
              {Array.from(details.entries()).map((entry, index) => {
                const [key, value] = entry;
                return (
                  <ConflictAccordion
                    key={index}
                    mainSong={key}
                    possibleSongs={value}
                    allSongs={details}
                  />
                );
              })}
            </UnorderedList>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
