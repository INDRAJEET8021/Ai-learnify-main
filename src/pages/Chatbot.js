import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RobotIcon from '@mui/icons-material/EmojiEmotions';
import UserIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SupportIcon from '@mui/icons-material/Support';
import MicIcon from '@mui/icons-material/Mic';
import { useAuth } from "../components/AuthContext/AuthContext";

// Function to convert markdown-like **bold**, *italic*, and new lines to HTML
const formatText = (text) => {
  // Convert **bold** to <strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em>
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert newlines to <br />
  formattedText = formattedText.replace(/\n/g, '<br />');

  return formattedText;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const { isLoggedIn,username} = useAuth();
  

  useEffect(() => {
    // Check for browser support
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setInput(spokenText);
        handleSend();
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Sorry, your browser does not support speech recognition.');
    }
  }, []);

  // Function to send message to Flask API
  const handleSend = async () => {
    if (input.trim()) {
      // Update state with user's message
      setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
      setInput('');
      setTyping(true);

      // Make a POST request to Flask API to get bot response
      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bot response');
        }

        const data = await response.json();
        const botResponse = data.response; // Get the response from Flask

        // Format the bot's response using the formatText function
        const formattedResponse = formatText(botResponse);

        // Simulate a delay before displaying bot response
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: formattedResponse, sender: 'bot' }]);
          setTyping(false);
        }, 1000);
      } catch (error) {
        console.error('Error sending message:', error);
        setTyping(false);
      }
    }
  };

  // Function to handle microphone click (speech-to-text)
  const handleMicClick = () => {
    if (recognition) {
      recognition.start();
    }
  };

  return (
    <div>
      <Navbar />
      <Container sx={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
          <ChatIcon sx={{ fontSize: 30, verticalAlign: 'middle', marginRight: 1 }} />
          AI Chatbot
          <SupportIcon sx={{ fontSize: 30, verticalAlign: 'middle', marginLeft: 1 }} />
        </Typography>
        <Card sx={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', boxShadow: 2, maxWidth: '600px', margin: '0 auto' }}>
          <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'bot' && <Avatar sx={{ marginRight: '10px' }}><RobotIcon /></Avatar>}
                <Box
                  sx={{
                    backgroundColor: msg.sender === 'user' ? '#3f51b5' : '#e0e0e0',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }} // Render formatted HTML
                />
                {msg.sender === 'user' && <Avatar sx={{ marginLeft: '10px' }}>{isLoggedIn?username.slice(0, 2).toUpperCase():<UserIcon />}</Avatar>}
              </Box>
            ))}
            {typing && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Avatar sx={{ marginRight: '10px' }}><RobotIcon /></Avatar>
                <Typography variant="body1" sx={{ color: '#000' }}>Typing...</Typography>
              </Box>
            )}
          </CardContent>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <TextField
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              fullWidth
              sx={{ marginRight: '10px' }}
              InputProps={{
                endAdornment: (
                  <Button onClick={handleMicClick} sx={{ p: 1 }}>
                    <MicIcon />
                  </Button>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              sx={{ backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Card>
      </Container>
    
    </div>
  );
};

export default Chatbot;
