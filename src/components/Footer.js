import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{backgroundColor: '#1976d2', color: 'white', padding: 4, marginTop: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} AI-Powered Learning. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          Follow us on:
          <a href="#" style={{ color: 'white', padding: '0 8px' }}>Facebook</a>
          <a href="#" style={{ color: 'white', padding: '0 8px' }}>Twitter</a>
          <a href="#" style={{ color: 'white', padding: '0 8px' }}>LinkedIn</a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
