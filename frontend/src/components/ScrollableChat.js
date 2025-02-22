import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { Text } from "@chakra-ui/react"; // Import Text for plain message content

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const renderMessageContent = (message) => {
    // Check if the message is an image, video, or text
    if (message.messageType === "image") {
      return (
        <img
          src={message.content} // Cloudinary image URL
          alt="Image"
          style={{
            maxWidth: "300px",
            maxHeight: "300px",
            borderRadius: "10px",
          }}
        />
      );
    } else if (message.messageType === "video") {
      return (
        <video controls style={{ maxWidth: "300px", borderRadius: "10px" }}>
          <source src={message.content} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <Text>{message.content}</Text>; // Display text message
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              flexDirection: m.sender._id === user._id ? "row-reverse" : "row", // Align user's messages to the right
              alignItems: "flex-start",
              marginBottom: "12px",
              marginLeft: m.sender._id === user._id ? "10px" : "0",
              marginRight: m.sender._id === user._id ? "0" : "10px",
            }}
          >
            {/* Avatar and Tooltip */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div style={{ marginRight: "10px" }}>
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="4px"
                    size="sm" // Smaller avatar
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                    boxShadow="0 2px 5px rgba(0, 0, 0, 0.2)" // Slight shadow for depth
                  />
                </Tooltip>
              </div>
            )}

            {/* Message Bubble */}
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: "20px",
                backgroundColor: `${
                  m.sender._id === user._id ? "#3182ce" : "#edf2f7"
                }`, // Blue for own messages, light gray for others
                color: m.sender._id === user._id ? "#fff" : "#333", // Text color adjustment
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id)
                  ? "2px"
                  : "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for message bubbles
                position: "relative",
                display: "inline-block",
                wordBreak: "break-word",
              }}
            >
              {/* Render message content: text, image, or video */}
              {renderMessageContent(m)}

              {/* Time display on hover */}
              <span
                style={{
                  display: "none",
                  position: "absolute",
                  bottom: "-20px",
                  right: "10px",
                  fontSize: "12px",
                  color: "#888",
                }}
                className="message-time"
              >
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      <style jsx>{`
        div:hover .message-time {
          display: block; /* Show time when hovering over the message */
        }
      `}</style>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
