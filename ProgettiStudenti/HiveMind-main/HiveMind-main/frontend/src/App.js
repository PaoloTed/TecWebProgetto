import './style/App.css'
import NavBar from './pages/NavBar/NavBar.js'
import NavBarAfterLogin from './pages/NavBar/NavBarAfterLogin.js';
import Footer from './pages/Footer.js';
import React, { useState, useEffect } from 'react';
import useFetch from './service/useFetch.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import NotFound from './pages/NotFound.js';
import { AuthProvider, useAuth} from './utils/AuthContex.js';
import ProtectedRoute from './route/ProtecteRoute.js';
import PublicRoute from './route/PublicRoute.js'; // Importa la nuova rotta pubblica
import ProtectedComponent from './route/ProtectedComponent.js';
import RichTextEditor from './pages/Card/insertCard.js'
import NotLogged from './pages/NotLogged.js';
import Popular from './pages/Card/Mainstream.js';
import UnPoular from './pages/Card/UnPopular.js';

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    console.log(`User is ${isLoggedIn ? 'logged in' : 'logged out'}`);
  }, [isLoggedIn]);
  
  return (
    <>
      {isLoggedIn ? <NavBarAfterLogin /> : <NavBar />}
      <div className="content">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mainstream" element={<Popular />} />
            <Route path="/unpopular" element={<UnPoular />} />
            <Route path="/homepage" element={<HomePage />} /> 
            <Route path="/protected" element={<ProtectedComponent />} />
            {isLoggedIn && (
              <Route path="/insert" element={<RichTextEditor />} />
            )}
            {!isLoggedIn && (
              <Route path="*" element={<NotFound />} />
            )}
            <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;