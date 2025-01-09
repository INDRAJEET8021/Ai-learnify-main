// src/EducatorDashboard.js
import React from 'react';

const EducatorDashboard = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <header className="w-full p-5 bg-blue-600 text-white">
        <h1 className="text-3xl">Educator Dashboard</h1>
      </header>
      <section className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Manage Courses</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Add Course</button>
        <div className="bg-white p-4 mt-4 shadow-md rounded">
          <div>Course 1 - [Details]</div>
          <div>Course 2 - [Details]</div>
        </div>
        <h2 className="mt-4 text-xl font-semibold">View Student Progress</h2>
        <div className="bg-white p-4 shadow-md rounded">
          <div>Student 1 - [Progress]</div>
          <div>Student 2 - [Progress]</div>
        </div>
      </section>
    </div>
  );
};

export default EducatorDashboard;
