import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // For redirection

  const modalRef = useRef(null); // Reference for modal content

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Register failed");
      }

      //   login(data.access_token);

      // localStorage.setItem('token', data.access_token); // Store token
      setSuccess("Register successful Please Login!");

      setTimeout(() => {
        onClose(); // Close the popup
      }, 500);
    } catch (err) {
      console.error("Register Error:", err.message); // Log error to console
      setError(err.message || "Something went wrong, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        {/* Login Form */}
        <h1 className="text-2xl mb-4 text-center text-black">Sign up</h1>
        {
          <form className="flex flex-col" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded mb-2 px-2 py-1 text-black"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded mb-2 px-2 py-1 text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded mb-2 px-2 py-1 text-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Register
            </button>
          </form>
        }

        {error && <p className="text-red-500 mt-2 font-medium">⚠️ {error}</p>}
        {/* Display success message */}
        {success && (
          <p className="text-green-500 mt-2 font-medium">✅ {success}</p>
        )}
        <p className="mt-4 text-center text-black">
          Already have an account?{" "}
          <button onClick={onClose} className="text-blue-600">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
