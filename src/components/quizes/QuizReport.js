import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation hook
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../Navbar";
import ChatButton from "../ChatButton ";

export default function QuizReport() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object

  // Extract score and totalQuestions from location.state
  const { score, totalQuestions } = location.state || {
    score: 0,
    totalQuestions: 0,
  };

  const calculatePerformance = (score) => {
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  const percentageScore = (score / totalQuestions) * 100;
  const performance = calculatePerformance(score);

  // Dynamic color based on performance
  const getColor = () => {
    if (percentageScore >= 80) return "#4caf50"; // green
    if (percentageScore >= 60) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          padding: "40px",
          maxWidth: "900px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: "30px",
            borderRadius: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Title Section */}
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", marginBottom: "20px", color: "#3f51b5" }}
          >
            Quiz Report
          </Typography>

          {/* Circular Progress and Percentage Score */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              width: 160,
              height: 160,
              margin: "auto",
            }}
          >
            {/* Grey Background Circle */}
            <CircularProgress
              variant="determinate"
              value={100} // Full circle
              size={160}
              thickness={5}
              sx={{
                color: "#9e9e9e", // Grey color for the background
                position: "absolute",
                zIndex: 1,
              }}
            />

            {/* Actual Progress Circle */}
            <CircularProgress
              variant="determinate"
              value={percentageScore}
              size={160}
              thickness={5}
              sx={{ color: getColor(), position: "relative", zIndex: 2 }}
            />

            {/* Centered Score Display */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ bgcolor: getColor(), width: 56, height: 56 }}>
                {percentageScore >= 60 ? <CheckCircleIcon /> : <ErrorIcon />}
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: getColor(),
                }}
              >
                {Math.round(percentageScore)}%
              </Typography>
            </Box>
          </Box>

          {/* Performance Feedback */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "20px", color: getColor() }}
          >
            Performance: {performance}
          </Typography>

          {/* Score Details */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "#3f51b5" }}
                >
                  Total Questions
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  {totalQuestions}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "#3f51b5" }}
                >
                  Correct Answers
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  {score} / {totalQuestions}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ marginY: "30px" }} />

          {/* Navigation Buttons */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                fullWidth
                onClick={() => navigate("/")}
                sx={{
                  padding: "10px",
                  borderColor: "#3f51b5",
                  color: "#3f51b5",
                  "&:hover": {
                    borderColor: "#2e3a8c",
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                Back to Home
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/quiz")}
                sx={{ padding: "10px" }}
              >
                Take Another Quiz
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <ChatButton />
      </Box>
    </div>
  );
}
