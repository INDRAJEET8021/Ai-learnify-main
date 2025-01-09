import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import CourseContent from "./CourseContent";
import ScrollProgress from "./ScrollProgress";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "../Navbar";
import ChatButton from "../ChatButton ";

export default function CourseDetails() {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [course, setCourse] = useState(null); // Store the course details
  const [selectedModule, setSelectedModule] = useState(null); // The selected module
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar visibility state

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  // Fetch course details when the component mounts
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        // http://localhost:5000/
        const response = await fetch(
          `https://ai-learnify-main-2.onrender.com/get_module?course-id=${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
              "Content-Type": "application/json", // Optional, ensures proper JSON request
            },
          }
        ); // Fetch course details
        if (response.ok) {
          const data = await response.json();
          setCourse(data); // Set course data
          setSelectedModule(data.modules[0]); // Set the first module as selected
          setLoading(false);
          setError(false);
        } else {
          console.error("Course not found");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Re-run when the courseId changes

  // if (!course) {
  //   return ; // Show a loading state until the course is fetched
  // }

  // Get the index of the current selected module'
  let currentModuleIndex = "";
  let nextModule;
  if (course && !error) {
    currentModuleIndex = course.modules.findIndex(
      (module) => module.moduleTitle === selectedModule?.moduleTitle
    );

    // Get the next module (if available)
    nextModule = course.modules[currentModuleIndex + 1];
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300, // Ensure it appears above all content
            flexDirection: "column",
          }}
        >
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: "#4caf50", // Modern green color
              animation: "spin 1.5s linear infinite",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              marginTop: 2,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Loading, please wait...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            color: "#ed070f",
            textAlign: "center",
            marginTop: "50px",
            height: "60vh",
          }}
        >
          <Typography>Error in Loading</Typography>
        </Box>
      ) : (
        <Box sx={{ padding: "20px" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              display: "inline-block", // Constrains styles to the content width
              top: 0,
              backgroundColor: "white", // Ensures background for sticky title
              zIndex: 1,
              padding: "10px 20px", // Adds padding for visual clarity
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Subtle shadow
              borderRadius: "8px", // Optional shadow for a nice effect
            }}
          >
            {course.title}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={12} sx={{ textAlign: "left" }}>
              <IconButton
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              >
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
                  sx={{
                    position: "sticky",
                    top: 20, // Keep the sidebar slightly below the top (adjust if needed)
                    height: "80vh", // Fixed height for the sidebar
                    overflowY: "auto", // Sidebar scrolls if content overflows
                    backgroundColor: "#f5f5f5", // Optional styling for the sidebar
                    borderRadius: "8px",
                    padding: "10px",
                  }}
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
            <Box>
              <ChatButton/>
            <ScrollProgress />

            </Box>
           
          </Grid>
        </Box>
      )}
    </>
  );
}
