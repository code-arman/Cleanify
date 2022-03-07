import {
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
} from "@chakra-ui/react";

export const SummaryModal = ({ isOpen, onClose, details }) => {
  const summary = `${details.numOriginalClean} songs were already clean! We found the clean versions of these ${details.numCleanFound} songs`;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Summary</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{summary}</Text>
          <OrderedList mt={4}>
            {details.cleanFound &&
              details.cleanFound.map((song, index) => (
                <ListItem key={index}>{song}</ListItem>
              ))}
          </OrderedList>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
