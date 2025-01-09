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
        bottom: '20px',
        right: '20px',
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
            color: '#f44790', // Change to your preferred color
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Add shadow for a more pronounced 3D effect
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
            color: 'dark', // Text color (white for contrast)
            fontWeight: 'bold', // Make text bold
            // Add shadow to the text for better visibility
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
            backgroundColor: '#f44790', // Button color
            color: '#fff', // Icon color
            '&:hover': {
              backgroundColor: '#c93a80', // Darker shade on hover
            },
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </Box>
  );
}
