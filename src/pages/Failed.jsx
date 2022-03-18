import { Heading, Flex, Link, VStack } from "@chakra-ui/layout";

function Failed() {
  return (
    <Flex align="center" justify="center" p={20}>
      <VStack>
        {" "}
        <Heading>Login Failed</Heading>
        <Link color="teal.500" href="/">
          Please refresh and try again
        </Link>
      </VStack>
    </Flex>
  );
}

export default Failed;
