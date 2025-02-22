import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          variant="outline"
          colorScheme="teal"
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          height={{ base: "450px", md: "400px" }}
          width="auto"
          px={4}
        >
          <ModalHeader
            fontSize={{ base: "32px", md: "40px" }}
            fontFamily="Work sans"
            textAlign="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Image
              borderRadius="full"
              boxSize={{ base: "120px", md: "150px" }}
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "24px", md: "28px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button onClick={onClose} colorScheme="blue" width="100px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
