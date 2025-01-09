import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../components/AuthContext/AuthContext";
import RegisterPage from './RegisterPage';

const AuthPage = ({onClose}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // For redirection
  const { login } = useAuth();

  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  

  const modalRef = useRef(null); // Reference for modal content

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close modal if clicked outside
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.access_token);

      // localStorage.setItem('token', data.access_token); // Store token
      setSuccess('Login successful!');

      setTimeout(() => {
        onClose(); // Close the popup
        // navigate('/dashboard'); // Redirect to dashboard
      }, 500);
    } catch (err) {
      console.error('Login Error:', err.message); // Log error to console
      setError(err.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>

      {/* Login Form */}
      <h1 className="text-2xl mb-4 text-center text-black">Sign In</h1>
      {
      <form className="flex flex-col" onSubmit={ handleLogin }>
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
          Login
        </button>
      </form>
      }

      {error && (
        <p className="text-red-500 mt-2 font-medium">
          ⚠️ {error}
        </p>
      )}
      {/* Display success message */}
      {success && (
        <p className="text-green-500 mt-2 font-medium">
          ✅ {success}
        </p>
      )}
      <p className="mt-4 text-center text-black">
        Don't have an account?{' '}
        <button onClick={()=>setShowRegisterPopup(true)} 
        className="text-blue-600">
          Sign Up
        </button>
        {showRegisterPopup && <RegisterPage onClose={()=>setShowRegisterPopup(false)}/>}
      </p>
    </div>
  </div>
  );
};

export default AuthPage;
