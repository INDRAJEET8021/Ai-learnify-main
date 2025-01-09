import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const[isLoggedIn,setIsLoggedIn]=useState(false);

  const [intendedRoute, setIntendedRoute] = useState(null);

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.name || '');
      setIsLoggedIn(true);      
    }
  }, []);
  
  const login = (token) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUsername(payload.name || '');
    setIsLoggedIn(true);
    // navigate('/progress')

    

    if (intendedRoute !== null) {
      console.log(intendedRoute);
      window.location.href = intendedRoute;
      setIntendedRoute(null); // Clear the intended route-
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsLoggedIn(false);

  };

  return (
    <AuthContext.Provider value={{ setIntendedRoute,isLoggedIn,username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
