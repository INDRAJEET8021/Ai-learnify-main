import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, IconButton, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import CourseContent from "./CourseContent";
import ScrollProgress from "./ScrollProgress";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "../Navbar";

export default function CourseDetails() {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [course, setCourse] = useState(null); // Store the course details
  const [selectedModule, setSelectedModule] = useState(null); // The selected module
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar visibility state

  // Fetch course details when the component mounts
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/get_module?course-id=${courseId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
            "Content-Type": "application/json", // Optional, ensures proper JSON request
          },
        }); // Fetch course details
        if (response.ok) {
          const data = await response.json();
          setCourse(data); // Set course data
          setSelectedModule(data.modules[0]); // Set the first module as selected
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Re-run when the courseId changes

  if (!course) {
    return <Typography variant="h6">Loading...</Typography>; // Show a loading state until the course is fetched
  }

  // Get the index of the current selected module
  const currentModuleIndex = course.modules.findIndex(
    (module) => module.moduleTitle === selectedModule?.moduleTitle
  );

  // Get the next module (if available)
  const nextModule = course.modules[currentModuleIndex + 1];

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ textAlign: "left" }}>
            <IconButton onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
              <MenuIcon />
            </IconButton>
          </Grid>

          {/* Sidebar */}
          {isSidebarVisible && (
            <Grid item xs={12} md={3}>
              <Sidebar
                topics={course.modules}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule} // Update selected module
              />
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={isSidebarVisible ? 9 : 12}>
            <CourseContent module={selectedModule} />
            {/* Load Next Button */}
            {nextModule && (
              <Button
                variant="contained"
                onClick={() => setSelectedModule(nextModule)}
                disabled={currentModuleIndex === course.modules.length - 1}
              >
                Next Module
              </Button>
            )}
          </Grid>

          <ScrollProgress />
        </Grid>
      </Box>
    </>
  );
}
