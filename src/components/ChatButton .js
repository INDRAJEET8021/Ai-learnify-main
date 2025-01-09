import React, { useState } from "react";
import {
  Box,
  Fab,
  Tooltip,
  Modal,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import RobotIcon from "@mui/icons-material/EmojiEmotions";
import UserIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../components/AuthContext/AuthContext";

// Styled Box for chatbot character
const ChatbotCharacter = styled(Box)({
  width: "60px",
  height: "60px",
  backgroundImage:
    "url(https://cdn3d.iconscout.com/3d/premium/thumb/chatbot-3d-icon-download-in-png-blend-fbx-gltf-file-formats--robot-chat-talk-communication-robotic-automation-internet-marketing-pack-business-icons-6497271.png?f=webp)",
  backgroundSize: "cover",
  borderRadius: "50%",
});

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { isLoggedIn, username } = useAuth();

  const togglePopup = () => setOpen(!open);

  // Function to format the bot's response if needed
  const formatText = (text) => {
    return text.replace(/(?:\r\n|\r|\n)/g, "<br>"); // Convert newlines to HTML line breaks
  };

  // Function to handle sending messages and receiving responses
  const handleSend = async () => {
    if (input.trim()) {
      // Update state with user's message
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");
      setTyping(true);

      // Make a POST request to Flask API to get the bot's response
      try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bot response");
        }

        const data = await response.json();
        const botResponse = data.response; // Extract bot's response from the API response

        // Format the bot's response
        const formattedResponse = formatText(botResponse);

        // Simulate a delay before displaying bot response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { text: formattedResponse, sender: "bot" },
          ]);
          setTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error sending message:", error);
        setTyping(false);
      }
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      <Tooltip title="Chat with AI" arrow placement="left">
        <Fab
          onClick={togglePopup}
          sx={{
            backgroundColor: "#e32431",
            color: "white",
            "&:hover": { backgroundColor: "#a64c52" },
            boxShadow: 3,
          }}
        >
          <ChatbotCharacter />
        </Fab>
      </Tooltip>

      <Modal
        open={open}
        onClose={togglePopup}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: 2,
        }}
      >
        <Card
          sx={{
            width: 400,
            height: 550,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            boxShadow: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              padding: "12px 16px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              AI Chatbot 🧠
            </Typography>
            <IconButton onClick={togglePopup} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Content */}
          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.sender === "bot" && (
                  <Avatar sx={{ marginRight: 1, backgroundColor: "#6a11cb" }}>
                    <RobotIcon />
                  </Avatar>
                )}
                <Box
                  sx={{
                    backgroundColor:
                      msg.sender === "user" ? "#2196f3" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "#000",
                    padding: "10px 15px",
                    borderRadius: "16px",
                    maxWidth: "70%",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.text, // Allow HTML rendering for formatted responses
                  }}
                />
                {msg.sender === "user" && (
                  <Avatar sx={{ marginLeft: 1, backgroundColor: "#1976d2" }}>
                    {isLoggedIn ? (
                      username.slice(0, 2).toUpperCase()
                    ) : (
                      <UserIcon />
                    )}
                  </Avatar>
                )}
              </Box>
            ))}

            {typing && (
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Avatar sx={{ marginRight: 1, backgroundColor: "#6a11cb" }}>
                  <RobotIcon />
                </Avatar>
                <Typography variant="body2" color="textSecondary">
                  Typing...
                </Typography>
              </Box>
            )}
          </CardContent>

          <Divider />

          {/* Input Area */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#ffffff",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              fullWidth
              sx={{
                marginRight: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              sx={{
                minWidth: "50px",
                padding: "10px",
                borderRadius: "50%",
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Card>
      </Modal>
    </Box>
  );
};

export default ChatButton;
