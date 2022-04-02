import {
  Box,
  Link,
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

export const SummaryModal = ({ isOpen, onClose, details, type, notType }) => {
  const summary = `${details.numOriginalClean} songs were already ${type}! We ${
    type === "explicit"
      ? `found the ${type} versions of ${
          details.numCleanFound - details.numStillMissing.length
        } songs. ${
          details.numStillMissing.length
        } clean songs were still added since no explicit version was found`
      : `found the ${type} versions of ${details.numCleanFound} songs.`
  }`;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={6}>
        <ModalHeader>Summary</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text pb={5}>{summary}</Text>
          {details.numStillMissing.length > 0 ? (
            <Box>
              <Text>{`Unable to find the ${type} version to these ${details.numStillMissing.length} songs. You can try clicking these links to see if you can find a ${type} version that exists`}</Text>
              <OrderedList mt={4}>
                {details.numStillMissing &&
                  details.numStillMissing.map(({ name, queryURL }, index) => (
                    <ListItem key={index}>
                      <Link isExternal href={queryURL}>
                        {name}
                      </Link>
                    </ListItem>
                  ))}
              </OrderedList>{" "}
            </Box>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
