import { Heading, Flex, Text, Link, VStack } from "@chakra-ui/layout";
// import { Button } from "@chakra-ui/react";
import OAuth2Login from "react-simple-oauth2-login";
import { REQUEST_INFO } from "../utils/Constants";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/SpotifyAuthContext";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

function Login() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  return (
    <Flex align="center" justify="center" p={20}>
      <VStack maxW={400}>
        <Heading>Cleanify</Heading>
        <Text textAlign="center">
          Convert your Explicit Spotify playlists into Clean playlists in the
          click of a button
        </Text>
        <Button>
          <OAuth2Login
            {...REQUEST_INFO}
            onSuccess={(res) => {
              setToken(res.access_token);
              localStorage.setItem("api-key", res.access_token);
              navigate("/home");
            }}
            onFailure={() => navigate("/fail")}
          />
        </Button>
        <Text as="h6">
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
