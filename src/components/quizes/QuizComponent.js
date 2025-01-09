import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import QuizReport from "./QuizReport"; // Component for showing the report after submission
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export default function QuizComponent() {
  const [quizType, setQuizType] = useState(""); // 'topic' or 'course'
  const [inputTopic, setInputTopic] = useState(""); // For user input on topic-based quiz
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [showReport, setShowReport] = useState(false);

  // This will fetch questions from the Flask API
  const fetchQuestions = (selectedTopic) => {
    axios
      .get(`http://localhost:5000/api/quiz?topic=${selectedTopic}`)
      .then((response) => {
        setQuestions(response.data); // Update questions with the response
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
        setQuestions([]); // If there's an error, clear the questions
      });
  };

  const handleStartQuiz = () => {
    if (inputTopic) {
      setQuizType("topic");
      fetchQuestions(inputTopic); // Fetch quiz for topic
    } else {
      // Implement course-based selection logic here
      setQuizType("course");
      // Assume we fetched questions based on course selection
      fetchQuestions("React"); // Example, later replace with real logic
    }
  };

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: option,
    });
  };

  const handleSkip = () => {
    setSkippedQuestions([
      ...skippedQuestions,
      questions[currentQuestionIndex].id,
    ]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleMarkForReview = () => {
    setMarkedForReview([
      ...markedForReview,
      questions[currentQuestionIndex].id,
    ]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleFinishQuiz = () => {
    setShowReport(true);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Search and Start Quiz Section */}
      {!questions.length && !showReport && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Start a Quiz
          </Typography>
          <TextField
            label="Enter topic or select course"
            variant="outlined"
            fullWidth
            value={inputTopic}
            onChange={(e) => setInputTopic(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <Button variant="contained" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </Box>
      )}

      {/* Display Questions if quiz has started */}
      {questions.length > 0 && !showReport && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {quizType === "topic" ? `Topic: ${inputTopic}` : `Course Quiz`}
          </Typography>

          {/* Progress Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {questions.map((q, index) => {
              let bgColor = "#e0e0e0"; // Default color
              if (answers[q.id]) bgColor = "#4caf50"; // Answered
              if (markedForReview.includes(q.id)) bgColor = "#ff9800"; // Marked for review
              if (skippedQuestions.includes(q.id)) bgColor = "#f44336"; // Skipped

              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: bgColor,
                    width: "40px",
                    height: "10px",
                    margin: "0 5px",
                    borderRadius: "5px",
                  }}
                />
              );
            })}
          </Box>

          {/* Current Question Display */}
          <Paper
            sx={{ padding: "20px", borderRadius: "12px", marginBottom: "20px" }}
          >
            <Typography variant="h6" gutterBottom>
              {`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {questions[currentQuestionIndex].question}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    answers[questions[currentQuestionIndex].id] === option
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Button
                variant="outlined"
                onClick={handleSkip}
                sx={{ marginRight: "10px" }}
              >
                Skip
              </Button>
              <Button
                variant="outlined"
                onClick={handleMarkForReview}
                sx={{ marginRight: "10px" }}
              >
                Mark for Review
              </Button>
            </Box>
            <IconButton
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              <ArrowForward />
            </IconButton>
          </Box>

          {/* Finish Quiz Button */}
          {currentQuestionIndex === questions.length - 1 && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleFinishQuiz}
            >
              Finish Quiz
            </Button>
          )}
        </Box>
      )}

      {/* Show Quiz Report */}
      {showReport && (
        <QuizReport
          questions={questions}
          answers={answers}
          markedForReview={markedForReview}
          skippedQuestions={skippedQuestions}
        />
      )}
    </Box>
  );
}
