import { Text } from "@chakra-ui/layout";
import { AUTH_ENDPOINT } from "../utils/Constants";
import { InfoIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  Icon,
  Image,
  Stack,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import CleanifyHomePage from "../assets/CleanifyHomePage.png";

function Login() {
  return (
    <Box px={8} py={24} mx="auto">
      <Box
        w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
        mx="auto"
        textAlign={{ base: "left", md: "center" }}
      >
        <chakra.h1
          mb={6}
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{ base: "normal", md: "tight" }}
          color={useColorModeValue("gray.900", "gray.100")}
        >
          Clean your{" "}
          <Text
            display={{ base: "block", lg: "inline" }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, #36b864,#1a411e)"
            fontWeight="extrabold"
          >
            Spotify Playlists
          </Text>{" "}
          the easy way.
        </chakra.h1>
        <chakra.p
          px={{ base: 0, lg: 24 }}
          mb={6}
          fontSize={{ base: "lg", md: "xl" }}
          color={useColorModeValue("gray.600", "gray.300")}
        >
          Cleanify allows you to easily convert your Explicit Spotify playlists
          into Clean Spotify playlists
        </chakra.p>
        <Stack
          direction={{ base: "column", sm: "row" }}
          mb={{ base: 4, md: 8 }}
          spacing={2}
          justifyContent={{ sm: "left", md: "center" }}
        >
          <Button
            as="a"
            variant="solid"
            bgColor="#36b864"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: "full", sm: "auto" }}
            mb={{ base: 2, sm: 0 }}
            size="lg"
            cursor="pointer"
            textColor={"white"}
            _hover={{ bgImg: "linear-gradient(rgba(0, 0, 0, 0.4) 0 0)" }}
            href={AUTH_ENDPOINT}
          >
            Login with Spotify
            <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </Icon>
          </Button>
          <Button
            as="a"
            colorScheme="gray"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: "full", sm: "auto" }}
            mb={{ base: 2, sm: 0 }}
            size="lg"
            cursor="pointer"
            href="https://github.com/code-arman/Cleanify"
          >
            View on Github
            <InfoIcon boxSize={4} ml={1} fill="currentColor"></InfoIcon>
          </Button>
        </Stack>
      </Box>
      <Box
        w={{ base: "full", md: 10 / 12 }}
        mx="auto"
        mt={20}
        textAlign="center"
      >
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src={CleanifyHomePage}
          alt="Cleanify Home Page screenshot"
        />
      </Box>
    </Box>
  );
}

export default Login;
