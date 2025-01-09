import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

const questions = [
  {
    id: 1,
    question: "What is AI?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
  },
  {
    id: 2,
    question: "What is React?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
  },
  // Add more questions here
];

export default function CourseBasedQuiz({ courseId }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleSkip = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => [...prev, currentQuestion.id]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleFinishQuiz = () => {
    // Generate report logic (e.g., score calculation)
    alert("Quiz finished! Generating report...");
  };

  return (
    <Box>
      <Paper
        sx={{ padding: "20px", marginBottom: "20px", borderRadius: "12px" }}
      >
        <Typography variant="h6" gutterBottom>
          {`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`}
        </Typography>
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            variant={
              answers[currentQuestion.id] === option ? "contained" : "outlined"
            }
            onClick={() => handleAnswer(option)}
            sx={{ display: "block", margin: "10px 0" }}
          >
            {option}
          </Button>
        ))}
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button variant="outlined" color="primary" onClick={handleSkip}>
          Skip
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleMarkForReview}
        >
          Mark for Review
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleFinishQuiz}
          >
            Finish Quiz
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next
          </Button>
        )}
      </Box>

      <Typography variant="body2">
        {`Questions marked for review: ${markedForReview.length}`}
      </Typography>
    </Box>
  );
}
