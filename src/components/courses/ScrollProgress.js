import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // Import the icon

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false); // State to manage the visibility of the scroll top button

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    
    setScrollProgress(scrolled);
    setShowScrollTop(scrollTop > 300); // Show button after scrolling down 300px
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll effect
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '80px', // Adjusted to position it above the chat button
        right: '17px', // Adjusted to position slightly to the right
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={scrollProgress}
          size={60}
          thickness={4}
          sx={{
            color: '#4caf50', // Green color for the progress circle (change to your desired color)
            borderRadius: '50%',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Enhanced shadow for a more prominent effect
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '1rem',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#000000', // Black color for the text
            fontWeight: 'bold', // Make text bold
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Shadow for better visibility
          }}
        >
          {Math.round(scrollProgress)}%
        </Typography>
      </Box>

      {showScrollTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            marginTop: 2,
            backgroundColor: '#4caf50', // Green color for the button
            color: '#fff', // Icon color (white for contrast)
            '&:hover': {
              backgroundColor: '#388e3c', // Darker green shade on hover
            },
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Subtle shadow on the button
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </Box>
  );
}
