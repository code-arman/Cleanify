import {
  Box,
  IconButton,
  useColorModeValue,
  VStack,
  Icon,
  useDisclosure,
  CloseButton,
  chakra,
  Flex,
  Link,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaGripLines } from "react-icons/fa";
import { useViewportScroll } from "framer-motion";
import React from "react";
const Header = ({ username }) => {
  const mobileNav = useDisclosure();

  const bg = useColorModeValue("white", "gray.800");
  const ref = React.useRef();
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

  const { scrollY } = useViewportScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  const ViewGithubButton = (
    <Box
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      as="a"
      aria-label="View Cleanify on Github"
      href="https://github.com/code-arman/Cleanify"
      target="_blank"
      rel="noopener noreferrer"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      px="1em"
      minH="36px"
      rounded="md"
      fontSize="sm"
      color="gray.800"
      outline="0"
      transition="all 0.3s"
      _hover={{
        bg: "gray.100",
        borderColor: "gray.300",
      }}
      _active={{
        borderColor: "gray.200",
      }}
      _focus={{
        boxShadow: "outline",
      }}
      ml={5}
    >
      <Icon as={FaGithub} w="4" h="4" color="black.500" mr="2" />
      <Link
        as={Box}
        href="https://github.com/code-arman/Cleanify"
        lineHeight="inherit"
        fontWeight="semibold"
        isExternal
      >
        View on Github
      </Link>
    </Box>
  );
  const MobileNavContent = (
    <VStack
      pos="absolute"
      top={0}
      left={0}
      right={0}
      display={mobileNav.isOpen ? "flex" : "none"}
      flexDirection="column"
      p={1}
      pb={2}
      m={1}
      bg={bg}
      spacing={1}
      rounded="sm"
      shadow="sm"
    >
      <CloseButton
        aria-label="Close menu"
        justifySelf="self-start"
        onClick={mobileNav.onClose}
      />
      <Link
        href="https://github.com/code-arman/Cleanify"
        variant="ghost"
        lineHeight="inherit"
        fontWeight="semibold"
        isExternal
      >
        View on Github
      </Link>
    </VStack>
  );
  return (
    <Box pos="relative">
      <chakra.header
        ref={ref}
        shadow={y > height ? "sm" : undefined}
        transition="box-shadow 0.2s"
        bg={bg}
        borderTop="6px solid"
        borderTopColor="#36b864"
        w="full"
        overflowY="hidden"
      >
        <chakra.div h="4.5rem" mx="auto" maxW="1200px">
          <Flex w="full" h="full" px="6" align="center" justify="space-between">
            <Flex align="center">
              <Link href="/">
                <HStack>
                  <Heading size="lg">Cleanify</Heading>
                </HStack>
              </Link>
            </Flex>

            <Flex
              justify="flex-end"
              w="full"
              maxW="824px"
              align="center"
              color="gray.400"
            >
              <HStack spacing="5" display={{ base: "none", md: "flex" }}>
                {username && <Text color="gray.900">{username}</Text>}
              </HStack>
              {ViewGithubButton}
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<FaGripLines />}
                onClick={mobileNav.onOpen}
              />
            </Flex>
          </Flex>
          {MobileNavContent}
        </chakra.div>
      </chakra.header>
    </Box>
  );
};
export default Header;
