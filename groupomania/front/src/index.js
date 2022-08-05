import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Settings from './pages/settings';
import NewPost from './pages/newpost';
import Profile from './pages/profile';

//all the route of the website with 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/newpost" element={<NewPost />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals