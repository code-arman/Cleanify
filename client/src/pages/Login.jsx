import { Heading, Flex, Text, Link, VStack } from "@chakra-ui/layout";
import { AUTH_ENDPOINT } from "../utils/Constants";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

function Login() {
  return (
    <Flex align="center" justify="center" p={20}>
      <VStack maxW={400}>
        <Heading>Cleanify</Heading>
        <Text textAlign="center">
          Convert your Explicit Spotify playlists into Clean playlists in the
          click of a button
        </Text>
        <Button as={Link} href={AUTH_ENDPOINT}>
          Login With Spotify
        </Button>
        <Text as="h6" pt={3}>
          Created by{" "}
          <Link
            color="teal.500"
            isExternal
            href="https://github.com/code-arman/"
          >
            @code-arman <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </VStack>
    </Flex>
  );
}

export default Login;
