import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Card,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatButton from "../components/ChatButton ";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import { useAuth } from "../components/AuthContext/AuthContext";
import Footer from "../components/Footer";

const courses = [
  { id: "ai", name: "Introduction to AI" },
  { id: "web-development", name: "Web Development for Beginners" },
];

export default function AdaptiveQuizPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [topic, setTopic] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionStatus, setQuestionStatus] = useState([]);

  const [loading, setLoading] = useState(false); // State to indicate loading

  const { isLoggedIn, logout } = useAuth();

  const [courses, setCourses] = useState([]); // State to hold course data
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const totalQuestions = quizData.length;

  const handleAdd = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (isLoggedIn) {
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
        })
        .catch((err) => {
          setError(err.message); // Set error message in case of failure
        });
    }
  }, [isLoggedIn]);

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  // Fetch quiz data from Flask API
  const fetchQuizData = async (course) => {
    try {
      if (!course) {
        throw new Error("Course is not selected or topic is not provided.");
      }

      setLoading(true);
      const response = await fetch(
        `https://ai-learnify-main-2.onrender.com/quiz?topic=${encodeURIComponent(
          course
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
      }

      const data = await response.json();

      // Ensure quiz data is in the correct format
      if (!data || !Array.isArray(data[0]?.quiz)) {
        throw new Error("Invalid quiz data structure.");
      }

      // Access quiz data from the response
      const quizData = data[0].quiz;

      // Set quiz data and initialize question status
      setQuizData(quizData);
      setQuestionStatus(new Array(quizData.length).fill("unanswered"));
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      alert("Failed to load quiz data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Start Quiz logic
  const handleStartQuiz = async () => {
    if (selectedCourse || topic) {
      setQuizStarted(true);
      fetchQuizData(selectedCourse || topic);
    }
  };

  // Reset the quiz to go back to the quiz selection screen
  const handleBackToSelection = () => {
    setQuizStarted(false);
    setSelectedCourse("");
    setTopic("");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizData([]); // Reset quiz data
  };

  // Handle Question Answer
  const handleAnswer = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = option;
    setAnswers(updatedAnswers);

    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestionIndex] = "saved";
    setQuestionStatus(updatedStatus);
  };

  // Navigation logic
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestionIndex] = "skipped";
    setQuestionStatus(updatedStatus);
    handleNext();
  };

  const handleFinishQuiz = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === quizData[index].correct
    ).length;

    navigate("/quiz-report", {
      state: { score: correctAnswers, totalQuestions: quizData.length },
    });
  };

  return (
    <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Navbar />
      <Box
        sx={{
          padding: "40px",
          maxWidth: "1200px",
          margin: "auto",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#1565c0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Test Yourself!
        </Typography>

        {!quizStarted ? (
          <Grid container spacing={3} sx={{ marginTop: "30px" }}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #bbdefb, #e3f2fd)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                  height: "320px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: "20px",
                    fontWeight: "bold",
                    color: "#0d47a1",
                    textAlign: "center",
                  }}
                >
                  Course-Based Quiz
                </Typography>
                {isLoggedIn ? (
                  !courses ? (
                    <Typography
                      sx={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "#757575",
                      }}
                    >
                      No Course Found{" "}
                      <Button
                        variant="contained"
                        onClick={handleAdd}
                        sx={{
                          marginLeft: "10px",
                          backgroundColor: "#0d47a1",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "#0a3871" },
                        }}
                        endIcon={<LibraryAddIcon />}
                      >
                        Add
                      </Button>
                    </Typography>
                  ) : (
                    <Accordion
                      sx={{
                        maxHeight: "450px",
                        overflow: "hidden",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        background:
                          "linear-gradient(to right, #e3f2fd, #f8f9fa)", // Subtle gradient background
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#0d47a1" }} />
                        }
                        sx={{
                          backgroundColor: "#f0f4ff",
                          borderBottom: "1px solid #e0e0e0",
                          "&:hover": {
                            backgroundColor: "#dfe8ff",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "500",
                            color: "#0d47a1",
                          }}
                        >
                          Select a Course
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          maxHeight: "150px", // Set the height for scrollable content
                          overflowY: "auto", // Add vertical scroll
                          padding: "10px",
                          backgroundColor: "#f9fbfd", // Subtle light background
                          scrollbarWidth: "none", // Hide scrollbar for Firefox
                          "&::-webkit-scrollbar": {
                            display: "none", // Hide scrollbar for Chrome and others
                          },
                        }}
                      >
                        <Grid container spacing={2}>
                          {courses.map((course) => (
                            <Grid item xs={12} key={course.id}>
                              <Button
                                variant={
                                  selectedCourse === course.id
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() => {
                                  setSelectedCourse(course.id);
                                  setTopic(""); // Reset topic if course is selected
                                }}
                                fullWidth
                                sx={{
                                  padding: "14px",
                                  fontWeight: "bold",
                                  backgroundColor:
                                    selectedCourse === course.id
                                      ? "#0d47a1"
                                      : "transparent",
                                  color:
                                    selectedCourse === course.id
                                      ? "#ffffff"
                                      : "#0d47a1",
                                  border: "2px solid #0d47a1",
                                  borderRadius: "8px",
                                  transition: "0.3s",
                                  "&:hover": {
                                    backgroundColor:
                                      selectedCourse === course.id
                                        ? "#0a3871"
                                        : "#e3f2fd",
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                {course.title}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )
                ) : (
                  <Typography
                    sx={{
                      textAlign: "center",
                      marginTop: "20px",
                      color: "#757575",
                    }}
                  >
                    No Course Found{" "}
                    <Button
                      variant="contained"
                      sx={{
                        marginLeft: "10px",
                        backgroundColor: "#0d47a1",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "#0a3871" },
                      }}
                    >
                      Login
                    </Button>
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #bbdefb, #e3f2fd)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                  height: "320px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: "20px",
                    fontWeight: "bold",
                    color: "#0d47a1",
                    textAlign: "center",
                  }}
                >
                  Topic-Based Quiz
                </Typography>
                <TextField
                  label="Enter a Topic"
                  variant="outlined"
                  fullWidth
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setSelectedCourse(""); // Reset course if topic is selected
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#0d47a1",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1565c0",
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        ) : loading ? (
          // Show loader while fetching quiz data
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#1565c0" }} />
          </Box>
        ) : (
          <Box>
            {/* Back Button */}
            <Button
              variant="contained"
              onClick={handleBackToSelection}
              sx={{
                marginBottom: "20px",
                backgroundColor: "#1e88e5",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              <KeyboardBackspaceIcon />
              Back
            </Button>

            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / totalQuestions) * 100}
              sx={{
                marginY: "10px",
                backgroundColor: "#f1f8ff",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1e88e5",
                },
              }}
            />

            <Card
              sx={{
                marginY: "20px",
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "20px",
                  fontWeight: "bold",
                  color: "#1e88e5",
                }}
              >
                {quizData[currentQuestionIndex].question}
              </Typography>
              <Grid container spacing={2}>
                {quizData[currentQuestionIndex].options.map((option) => (
                  <Grid item xs={6} key={option}>
                    <Button
                      variant={
                        answers[currentQuestionIndex] === option
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleAnswer(option)}
                      fullWidth
                      sx={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #1e88e5",
                        backgroundColor:
                          answers[currentQuestionIndex] === option
                            ? "#1e88e5"
                            : "#f1f8ff",
                        color:
                          answers[currentQuestionIndex] === option
                            ? "#ffffff"
                            : "#1e88e5",
                        "&:hover": {
                          backgroundColor:
                            answers[currentQuestionIndex] === option
                              ? "#1565c0"
                              : "#e3f2fd",
                        },
                      }}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                sx={{
                  padding: "10px",
                  borderColor: "#1e88e5",
                  color: "#1e88e5",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#f1f8ff",
                  },
                }}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                onClick={handleSkip}
                sx={{
                  padding: "10px",
                  backgroundColor: "#1e88e5",
                  color: "#ffffff",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Skip
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                sx={{
                  padding: "10px",
                  backgroundColor: "#1e88e5",
                  color: "#ffffff",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Next
              </Button>
            </Box>

            {currentQuestionIndex === totalQuestions - 1 && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleFinishQuiz}
                sx={{
                  marginTop: "20px",
                  padding: "12px",
                  fontSize: "16px",
                  backgroundColor: "#1976d2",
                }}
              >
                Finish Quiz
              </Button>
            )}
          </Box>
        )}

        {!quizStarted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartQuiz}
            disabled={!selectedCourse && !topic}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(45deg, #115293, #1e88e5)",
                transform: "scale(1.05)",
              },
            }}
          >
            Start Quiz
          </Button>
        )}
      </Box>

      <ChatButton />
    </div>
  );
}
