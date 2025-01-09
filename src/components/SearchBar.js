import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext/AuthContext";
import AuthPage from "../pages/AuthPage";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    if (isLoggedIn) {
      if (!query) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://ai-learnify-main-2.onrender.com/api/courses/search?query=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setSearchResults(data.courses);
        setNoResults(data.courses.length === 0);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowAuthPopup(true);
    }
  };

  return (
    <Box sx={{ padding: "20px", marginTop: "20px" }}>
      {/* Search Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <TextField
          variant="outlined"
          label="Search to start courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            width: { xs: "80%", sm: "60%", md: "50%" },
            backgroundColor: "#f5f5f5", // Changed to a lighter background color
            borderRadius: "10px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.05)", // Lighter shadow
            "& .MuiInputBase-root": {
              paddingLeft: "20px",
              color: "#333", // Darker text for better readability
            },
            "& .MuiInputLabel-root": {
              color: "#333", // Dark label color for contrast
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976D2", // Different color for search button
            "&:hover": { backgroundColor: "ff4081" },
            padding: "12px 25px",
            fontSize: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            marginTop: "20px",
          }}
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
        {showAuthPopup && <AuthPage onClose={() => setShowAuthPopup(false)} />}
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <>
          {/* Darken the screen */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Darken the background
              zIndex: 9998, // Below the loader
              pointerEvents: "none", // Prevent the overlay from blocking interaction
            }}
          />

          {/* Loader with blur effect */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999, // On top of the darkened overlay
              backdropFilter: "blur(5px)", // Apply blur effect to the background content
              borderRadius: "8px", // Optional: for rounded corners
              padding: "20px", // Optional: add padding to give the spinner more breathing room
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background for the spinner
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: add shadow for visual depth
            }}
          >
            <CircularProgress size={60} color="primary" />
          </Box>
        </>
      )}

      {/* Search Results Section */}
      {isLoggedIn && !loading && searchResults.length > 0 && (
        <Box sx={{ marginTop: "40px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centers horizontally
              textAlign: "center", // Ensures the text is centered
              marginBottom: "30px", // Ensures the text is centered
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#fff", // White text color for contrast
                background: "linear-gradient(to right, #ff4081, #ff80ab)", // Gradient background
                padding: "15px 20px", // Add padding for spacing
                borderRadius: "10px", // Rounded corners for a modern look

                letterSpacing: "2px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Shadow for a floating effect
                backgroundClip: "border-box", // Ensure the background is clipped to the borders
                display: "inline-block", // Make sure it's not full width
                // Spacing below the heading
              }}
            >
              Your Search Result..
            </Typography>
          </Box>

          <Divider sx={{ marginBottom: "20px" }} />
          <Grid container spacing={3} justifyContent="center">
            {searchResults.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: "15px",
                    boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.25)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: "#0b1112",
                        fontSize: "1.2rem",
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: "20px",
                        minHeight: "50px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Box sx={{ textAlign: "center" }}>
                      <Link
                        to={`/course-details/${course.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#388e3c",
                            "&:hover": { backgroundColor: "#2c6b2f" },
                            borderRadius: "10px",
                            padding: "10px 25px",
                            fontSize: "16px",
                          }}
                        >
                          Start Course
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Results Found */}
      {noResults && !loading && (
        <Box sx={{ marginTop: "40px", textAlign: "center" }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: "bold" }}>
            No courses found for your search.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
