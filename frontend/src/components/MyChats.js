import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../context/ChatProvider";
import { Box, Stack, Text, Flex } from "@chakra-ui/layout";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { Avatar, useColorModeValue } from "@chakra-ui/react";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  // Fetch chats from the server
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Run on component mount or when fetchAgain changes
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // Dynamic colors based on light/dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const chatBgColor = useColorModeValue("#E8E8E8", "#3B3B3B");
  const selectedChatBgColor = useColorModeValue("#38B2AC", "#3182CE");
  const chatTextColor = useColorModeValue("black", "white");
  const sectionBgColor = useColorModeValue("#F8F8F8", "gray.700");

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={bgColor} // Background for the chat container
      w={{ base: "100%", md: "40%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "26px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "14px", md: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={sectionBgColor} // Dynamic section background
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? selectedChatBgColor : chatBgColor} // Dynamic chat box background
                color={selectedChat === chat ? "white" : chatTextColor} // Dynamic chat text color
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  size="sm"
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                  }
                  src={
                    chat.isGroupChat
                      ? ""
                      : getSenderFull(loggedUser, chat.users).pic
                  }
                  mr={2}
                />
                <Text fontSize={{ base: "14px", md: "16px" }}>
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(loggedUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
