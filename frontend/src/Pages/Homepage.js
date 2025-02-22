import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      {/* Header Section */}
      <Box
        d="flex"
        justifyContent="center"
        p={4}
        bgGradient="linear(to-r, blue.400, cyan.400)"
        width="100%"
        borderRadius="lg"
        boxShadow="md"
        marginTop="20px"
        marginBottom="30px"
      >
        <Heading
          fontSize="4xl"
          fontFamily="Work sans"
          color="white"
          textAlign="center"
        >
          THUNDER-CHAT
        </Heading>
      </Box>

      {/* Tabs Section */}
      <Box
        bg="white"
        w="100%"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        maxWidth="md"
      >
        <Tabs isFitted variant="solid-rounded" colorScheme="teal">
          <TabList mb="1em">
            <Tab fontWeight="bold">Login</Tab>
            <Tab fontWeight="bold">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Footer Section */}
      <VStack mt="6" spacing="4" color="gray.600">
        <Text fontSize="sm">Experience seamless chat with Thunder-Chat</Text>
        <Text fontSize="xs">© 2024 Thunder-Chat. All rights reserved.</Text>
      </VStack>
    </Container>
  );
};

export default Homepage;
