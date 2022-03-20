import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Text,
} from "@chakra-ui/react";

const ProgressBar = ({ value }) => {
  return (
    <Center h="700px" flexDir="column">
      <Text fontSize={20} mb={3}>
        Conversion Progress
      </Text>
      <CircularProgress value={value} size="80px" color="blue.400">
        <CircularProgressLabel>{Math.round(value)}%</CircularProgressLabel>
      </CircularProgress>
    </Center>
  );
};

export default ProgressBar;
