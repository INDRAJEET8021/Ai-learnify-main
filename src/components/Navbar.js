import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import SegmentIcon from "@mui/icons-material/Segment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext/AuthContext";
import AuthPage from "../pages/AuthPage";

export default function Navbar() {
  const navigate = useNavigate();

  const [anchorMenu, setAnchorMenu] = useState(null); // State for SegmentIcon menu
  const [anchorAvatar, setAnchorAvatar] = useState(null); // State for Avatar dropdown

  const { setIntendedRoute, isLoggedIn, username, logout } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Open and Close Handlers for Menus
  const handleMenuClick = (event) => setAnchorMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorMenu(null);

  const handleAvatarClick = (event) => setAnchorAvatar(event.currentTarget);
  const handleAvatarClose = () => setAnchorAvatar(null);

  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "primary.light", height: "70px" }}
    >
      <Toolbar>
        {/* App Name */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "8px 16px",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              borderRadius: "50px", // Rounded container for the logo and text
              padding: "10px 20px",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "45px", // Make the image responsive and larger
                height: "auto", // Maintain aspect ratio
                borderRadius: "10px", // Apply border radius for rounded corners
                marginRight: "12px", // Space between logo and text
                background: "#13192b", // White background for the logo
                padding: "6px", // Padding to make the logo stand out
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Shadow effect for the logo
                objectFit: "contain",
                transition: "transform 0.3s ease", // Smooth transition on hover
              }}
            />
            <span
              style={{
                fontWeight: "700", // Bold text for emphasis
                fontSize: "1.5rem", // Slightly larger font size
                color: "#ffffff", // White color for the text
                textTransform: "uppercase", // Make text uppercase for boldness
                letterSpacing: "1.5px", // Space between letters for a modern look
                transition: "color 0.3s ease, transform 0.3s ease", // Smooth transition for color and scale
              }}
            >
              AI Learning
            </span>
          </a>
        </Typography>

        {/* Hamburger Menu for Navigation */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenuClick}
          
        >
          <SegmentIcon size="larger" />
        </IconButton>
        <Menu
          anchorEl={anchorMenu}
          open={Boolean(anchorMenu)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/dashboard");
            }}
          >
            Start Learning!
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              if (isLoggedIn) {
                navigate("/progress");
              } else {
                setShowAuthPopup(true);

                setIntendedRoute("/progress");
              }
            }}
          >
            Adaptive Learning
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/quiz");
            }}
          >
            Interactive Quizzes
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/chatbot");
            }}
          >
            AI Chatbot
          </MenuItem>
        </Menu>

        {/* Login/Avatar with Dropdown */}
        {!isLoggedIn ? (
          <div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "orange",
                ":hover": { backgroundColor: "darkorange" },
                borderRadius: "20px",
                padding: "10px 20px",
              }}
              onClick={() => setShowAuthPopup(true)}
            >
              Get Started
            </Button>
            {showAuthPopup && (
              <AuthPage onClose={() => setShowAuthPopup(false)} />
            )}
          </div>
        ) : (
          <>
            {/* Avatar Dropdown */}
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                marginRight: 2,
                cursor: "pointer",
              }}
              size="larger"
              onClick={handleAvatarClick}
            >
              {username.slice(0, 2).toUpperCase()}
            </Avatar>
            <Menu
              anchorEl={anchorAvatar}
              open={Boolean(anchorAvatar)}
              onClose={handleAvatarClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleAvatarClose}>
                <Typography>{username}</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAvatarClose();
                  logout();
                }}
              >
                <Typography variant="inherit" color="error">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
