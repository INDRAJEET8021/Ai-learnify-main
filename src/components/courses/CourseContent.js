import React from "react";
import { Typography, Box } from "@mui/material";

// Function to convert markdown-like **bold**, *italic*, and new lines to HTML
const formatText = (text) => {
  // Convert **bold** to <strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert *italic* to <em>
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert newlines to <br />
  formattedText = formattedText.replace(/\n/g, "<br />");

  return formattedText;
};

export default function CourseContent({ module }) {
  return (
    <Box>
      {module && (
        <>
          {/* Use Typography with variant for module title */}
          <Typography variant="h4" component="h5" gutterBottom>
            {module.moduleTitle}
          </Typography>

          {module.headings.map((heading, index) => (
            <Box key={index} sx={{ marginBottom: "20px" }}>
              {/* Use Typography with variant for heading */}
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold" }}
              >
                {heading.heading}
              </Typography>

              {/* Render formatted description with dangerouslySetInnerHTML */}
              <Typography
                variant="body1"
                component="p"
                sx={{ whiteSpace: "pre-line" }} // Preserves newlines from description text
                dangerouslySetInnerHTML={{
                  __html: formatText(heading.description),
                }}
              />
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
