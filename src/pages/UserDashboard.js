import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/Navbar'; // Import the Navbar component
import Footer from '../components/Footer'; // Import Footer component
import SearchBar from '../components/SearchBar';  // Importing the SearchBar


export default function UserDashboard() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Dashboard */}
      <Box sx={{ padding: '30px', minHeight: '80vh' }}>
        {/* Welcome Section */}
        <Typography variant="h4" gutterBottom>
          Welcome to AI Learning Platform!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Ready to begin your learning journey? Start by searching for courses below.
        </Typography>

        {/* Search Bar Section */}
       
        <SearchBar/> 
      </Box>

      {/* Footer */}
    </div>
  );
}
