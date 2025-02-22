import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Text,
  IconButton,
  useToast,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  IoMdSend,
  IoMdAttach,
  IoMdImage,
  IoMdVideocam,
  IoMdMic,
} from "react-icons/io";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { useColorModeValue } from "@chakra-ui/react";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CHAT app");

    const uploadUrl = {
      image: "https://api.cloudinary.com/v1_1/dvowuasmp/image/upload",
      video: "https://api.cloudinary.com/v1_1/dvowuasmp/video/upload",
      audio: "https://api.cloudinary.com/v1_1/dvowuasmp/raw/upload",
    }[fileType];

    try {
      const response = await axios.post(uploadUrl, formData);
      const fileUrl = response.data.secure_url;

      // Send file URL as a message
      sendMediaMessage(fileUrl, file.type);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleAttachClick = (type) => {
    setFileType(type);
    const acceptTypes = {
      image: "image/*",
      video: "video/*",
      audio: "audio/*",
    };

    fileInputRef.current.accept = acceptTypes[type];
    fileInputRef.current.click(); // Open the file picker dialog
  };
  const sendMediaMessage = async (fileUrl, fileType) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/message",
        {
          content: fileUrl,
          chatId: selectedChat._id,
          messageType: fileType.includes("image") ? "image" : "video",
        },
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send the media message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
            messageType: "text",
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const bg = useColorModeValue("gray.100", "gray.800");
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color={textColor}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={bg}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="auto"
            backgroundSize="cover"
            backgroundPosition="center"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl mt={3} display="flex" alignItems="center">
              {istyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <Input
                type="file"
                ref={fileInputRef}
                display="none"
                onChange={handleFileUpload}
              />

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<IoMdAttach />}
                  size="lg"
                  color={textColor}
                  bg={inputBg}
                  ml={2}
                />
                <MenuList>
                  <MenuItem
                    icon={<IoMdImage />}
                    onClick={() => handleAttachClick("image")}
                  >
                    Image
                  </MenuItem>
                  <MenuItem
                    icon={<IoMdVideocam />}
                    onClick={() => handleAttachClick("video")}
                  >
                    Video
                  </MenuItem>
                  <MenuItem
                    icon={<IoMdMic />}
                    onClick={() => handleAttachClick("audio")}
                  >
                    Audio
                  </MenuItem>
                </MenuList>
              </Menu>

              <Input
                variant="filled"
                bg={inputBg}
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                color={textColor}
                flexGrow="1"
              />
              <IconButton
                icon={<IoMdSend />}
                color={textColor}
                bg={inputBg}
                ml={2}
                onClick={sendMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color={textColor}
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a chat to start messaging
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
