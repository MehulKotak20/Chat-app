import { Box, Text, Flex, Divider, useColorModeValue } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  // Set dynamic values for light/dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.500", "gray.300");
  const headerBgColor = useColorModeValue("teal.600", "teal.500");
  const headerTextColor = useColorModeValue("white", "gray.200");
  const dividerColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh" // Full height for centering
      width="100vw" // Full width
      bg={bgColor} // Dynamic background color based on light/dark mode
      p={4}
    >
      {selectedChat ? (
        <Box
          display="flex"
          flexDir="column"
          w="100%" // Full width of the viewport
          h="100%" // Full height of the viewport
          borderRadius="lg"
          borderWidth="1px"
          boxShadow="lg"
          bg={boxBgColor} // Dynamic background color for the chatbox container
          overflow="hidden" // Prevent overflow
        >
          {/* Header Section */}
          <Flex
            align="center"
            justify="center"
            p={4}
            bg={headerBgColor} // Dynamic header background color
            color={headerTextColor} // Dynamic header text color
            borderRadius="md"
          >
            <Text fontSize="lg" fontWeight="semibold" isTruncated>
              Chatbox
            </Text>
          </Flex>
          {/* Divider */}
          <Divider borderColor={dividerColor} /> {/* Dynamic divider color */}
          {/* Chat Area */}
          <Box
            flex="1"
            display="flex"
            flexDir="column"
            overflowY="auto"
            p={3}
            height="calc(100vh - 100px)" // Adjust height to fit within the viewport
          >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
          flexDir="column"
          bg={boxBgColor} // Dynamic background color for "No Chat Selected" box
          borderRadius="lg"
          borderWidth="1px"
          p={4}
        >
          <Text fontSize="2xl" color={textColor} mb={4}>
            No Chat Selected
          </Text>
          <Text fontSize="md" color={textColor}>
            Select a chat from the left to start messaging
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default Chatbox;
