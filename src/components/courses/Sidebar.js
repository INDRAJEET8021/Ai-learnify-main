import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function Sidebar({ topics, selectedModule, setSelectedModule }) {
  return (
    <List
      sx={{
        backgroundColor: "#ffffff", // Clean white background
        padding: "10px",
        borderRadius: "8px",
        maxHeight: "80vh", // Limit the height
        overflowY: "auto", // Scrollable if needed
        position: "sticky", // Sticky positioning
        top: "calc(64px + 20px)", // Adjust based on parent layout
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      {topics.map((module) => (
        <ListItem
          button
          key={module.moduleTitle}
          selected={module.moduleTitle === selectedModule?.moduleTitle}
          onClick={() => setSelectedModule(module)} // Pass entire module object
          sx={{
            backgroundColor:
              module.moduleTitle === selectedModule?.moduleTitle
                ? "#3f51b5" // Highlighted blue for selected
                : "transparent",
            color:
              module.moduleTitle === selectedModule?.moduleTitle
                ? "#ffffff" // White text for selected
                : "#333333", // Dark text for non-selected
            marginBottom: "5px",
            borderRadius: "4px",
            cursor: "pointer", // Pointer cursor for all items
            "&:hover": {
              backgroundColor:
                module.moduleTitle === selectedModule?.moduleTitle
                  ? "#2e3b8e" // Darker blue on hover for selected
                  : "#f0f0f0", // Light gray hover for non-selected
              color:
                module.moduleTitle === selectedModule?.moduleTitle
                  ? "#ffffff" // Keep white text on hover for selected
                  : "#333333", // Keep dark text for non-selected
            },
          }}
        >
          <ListItemText
            primary={module.moduleTitle}
            sx={{
              fontWeight:
                module.moduleTitle === selectedModule?.moduleTitle
                  ? "bold" // Bold text for selected
                  : "normal", // Normal text for non-selected
              fontSize: "16px", // Slightly larger font size
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
