import React from 'react';

const CourseContentPage = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <header className="w-full p-5 bg-blue-600 text-white">
        <h1 className="text-3xl">Course Title</h1>
      </header>
      <section className="mt-10 w-full max-w-4xl">
        <video controls className="w-full rounded shadow-md">
          <source src="[Video Source]" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <aside className="mt-4">
          <h2 className="text-xl font-semibold">Lessons</h2>
          <ul className="list-disc pl-5">
            <li>Lesson 1</li>
            <li>Lesson 2</li>
          </ul>
        </aside>
        <textarea className="mt-4 w-full h-32 border rounded" placeholder="Take notes..."></textarea>
      </section>
      <section className="mt-4 w-full max-w-4xl">
        <h3 className="text-xl font-semibold">Comments</h3>
        <textarea className="mt-2 w-full h-24 border rounded" placeholder="Leave a comment..."></textarea>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </section>
    </div>
  );
};

export default CourseContentPage;
