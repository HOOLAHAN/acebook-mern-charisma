import './App.css';
import NavBar from '../navbar/Navbar';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../user/SignUpForm';
import React from 'react';
import Feed from '../feed/Feed';
import { useNavigate, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <NavBar navigate={useNavigate()}/>
      <Routes>
        <Route path='/posts' element={<Feed navigate={useNavigate()} />} />
        <Route path='/login' element={<LoginForm navigate={useNavigate()} />} />
        <Route
          path='/signup'
          element={<SignUpForm navigate={useNavigate()} />}
        />
      </Routes>
    </>
  );
};

export default App;
