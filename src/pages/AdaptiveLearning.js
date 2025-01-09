import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton ";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

export default function AdaptiveLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://ai-learnify-main-2.onrender.com/api/courses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
        "Content-Type": "application/json", // Optional, ensures proper JSON request
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data.courses); // Set the course data to state
        setLoading(false); // Data loaded, set loading to false
      })
      .catch((err) => {
        setError(err.message); // Set error message in case of failure
        setLoading(false); // Stop loading
      });
  }, []);

  // Function to remove course from the list
  const handleRemoveCourse = (courseTitle) => {
    const token = localStorage.getItem("token");

    // http://localhost:5000/register
    fetch("https://ai-learnify-main-2.onrender.com/api/remove_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ course_title: courseTitle }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove the course");
        }
        return response.json();
      })
      .then((data) => {
        if (data.updated_courses && data.updated_courses.length > 0) {
          setCourses(data.updated_courses);
        } else {
          setCourses(null);
        }
      })
      .catch((err) => {
        console.error(err.message);
        alert("Error removing the course. Please try again.");
      });
  };

  const getRandomProgress = () => Math.floor(Math.random() * 101);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h6">Loading courses...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      {isLoggedIn ? (
        <Box sx={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Introduction Section */}
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#161717" }}
          >
            Adaptive Learning
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ fontSize: "1.1rem" }}
          >
            Our adaptive learning system provides personalized learning
            experiences based on your progress and performance.
          </Typography>

          {/* Course Cards Section */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#161717" }}
          >
            Your Courses
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          {courses === null ? (
            <Box sx={{ textAlign: "center", marginTop: "50px" }}>
              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ fontWeight: "bold" }}
              >
                Oops! It seems like there are no courses available for you at
                this moment.
              </Typography>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="contained"
                endIcon={<AddToPhotosIcon />}
              >
                Add
              </Button>
              <Divider sx={{ marginY: 3 }} />
              <Typography variant="body1" color="textSecondary" paragraph>
                We have some personalized recommendations For You
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {courses.map((course, index) => {
                const progress = getRandomProgress();
                return (
                  <Grid item xs={12} md={4} key={index}>
                    <Card
                      sx={{
                        boxShadow: 5,
                        borderRadius: 2,
                        padding: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "0.3s ease",
                        "&:hover": { transform: "scale(1.05)", boxShadow: 15 },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#1976d2" }}
                        >
                          {course.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Progress: {progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ marginTop: 2 }}
                        />
                      </CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: 2,
                        }}
                      >
                        <Link
                          to={`/course-details/${course.id}`}
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              backgroundColor: "#1976d2",
                              "&:hover": { backgroundColor: "#1565c0" },
                              padding: "10px",
                            }}
                          >
                            Continue Learning
                          </Button>
                        </Link>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            marginLeft: 2,
                            padding: "8px 16px",
                            fontSize: "0.875rem",
                            borderRadius: "4px",
                            textTransform: "none",
                          }}
                          onClick={() => handleRemoveCourse(course.title)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
              <Divider sx={{ marginY: 3 }} />
            </Grid>
          )}

          {/* Recommendations Section */}
          <Box mt={4}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#ff4081" }}
            >
              Personalized Recommendations
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body2" color="textSecondary" paragraph>
              Based on your learning progress, here are some recommended courses
              for you to explore next.
            </Typography>

            <Grid container spacing={4}>
              {/* Recommendation 1 */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    boxShadow: 5,
                    borderRadius: 2,
                    padding: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s ease",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 15 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      Introduction to AI
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        marginTop: 2,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                      }}
                    >
                      Explore Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recommendation 2 */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    boxShadow: 5,
                    borderRadius: 2,
                    padding: 3,
                    height: "100%", // Fix height to prevent varying sizes based on content
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s ease",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 15 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      Deep Learning Fundamentals
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        marginTop: 2,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                      }}
                    >
                      Explore Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Quiz Section Styled as Popup */}
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: 20,
              background: "linear-gradient(145deg, #6e7dff, #4f63cc)",
              boxShadow: "0 6px 30px rgba(0, 0, 0, 0.2)",
              borderRadius: "30px",
              padding: "16px 20px",
              zIndex: 9999,
              width: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.3s ease-in-out",
              opacity: 0.95,
              cursor: "pointer",
              animation: "popupAnimation 0.5s ease-in-out", // Slight popup animation for extra charm
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "white", // White text for contrast
                fontSize: "1.1rem",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              Test Your Knowledge
            </Typography>
            <Button
              href="/quiz"
              variant="contained"
              sx={{
                backgroundColor: "#4f63cc",
                color: "white",
                width: "100%",
                padding: "10px 20px",
                borderRadius: "25px",
                "&:hover": {
                  backgroundColor: "#3b4fa8",
                  transform: "scale(1.05)",
                },
                textTransform: "none",
              }}
            >
              Take a Quiz
            </Button>
          </Box>
        </Box>
      ) : (
        navigate("/")
      )}
      <ChatButton />
     
    </div>
  );
}
