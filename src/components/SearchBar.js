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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

import { useAuth } from "../components/AuthContext/AuthContext";
import AuthPage from "../pages/AuthPage";

export default function SearchBar() {
  const [query, setQuery] = useState(""); // Search query state
  const [searchResults, setSearchResults] = useState([]); // Results state
  const [noResults, setNoResults] = useState(false); // No results state
  const [loading, setLoading] = useState(false); // Loading state

  const { isLoggedIn } = useAuth();

  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const token = localStorage.getItem('token');


  // Function to handle search
  const handleSearch = async () => {
    if (isLoggedIn) {
      if (!query) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setLoading(true); // Start loading state
      try {
        console.log(token);
        const response = await fetch(
          // http://localhost:5000/
          `https://ai-learnify-main-2.onrender.com/api/courses/search?query=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`, // Replace accessToken with the valid token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setSearchResults(data.courses); // Assume the API returns an object with a 'courses' array
        setNoResults(data.courses.length === 0);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setNoResults(true);
      } finally {
        setLoading(false); // End loading state
      }
    } else {
      setShowAuthPopup(true);
    }
  };

  return (
    <Box sx={{ padding: "20px", marginTop: "20px" }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <TextField
          variant="outlined"
          label="Search for courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ width: "60%", marginRight: "10px" }}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
        {showAuthPopup && <AuthPage onClose={() => setShowAuthPopup(false)} />}
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Display Search Results */}
      <Box>


        {isLoggedIn && searchResults.length > 0 && !loading && (
          <Grid container spacing={3}>
            {searchResults.map((course, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {course.description}
                    </Typography>
                    <Link to={`/course-details/${course.id}`}>
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: 2,
                          backgroundColor: "#1976d2",
                          "&:hover": { backgroundColor: "#1565c0" },
                        }}
                      >
                        Start Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* No Results Found */}
        {noResults && !loading && (
          <Typography
            variant="body1"
            align="center"
            color="error"
            sx={{ marginTop: "20px" }}
          >
            No courses found matching your search.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
