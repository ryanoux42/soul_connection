import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import Statistics from './Statistics';
import Customers from './Customer';
import Coaches from './Coaches';
import Compatibility from './Compatibility';
import Clothes from './Clothes';
import Tips from './Tips';
import Events from './Events';
import CreateCoach from './CreateCoaches';

function App() {
  const [userId, setUserId] = useState('');
  const [isCoach, setIsCoach] = useState('');
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login setUserId={setUserId} setIsCoach={setIsCoach} setToken={setToken} />} />
        <Route path="/home" element={<Home userId={userId} isCoach={isCoach} token={token}/>} />
        <Route path="/profile" element={<Profile userId={userId} isCoach={isCoach} token={token}/>} />
        <Route path="/statistics" element={<Statistics userId={userId} isCoach={isCoach} token={token}/>} />
        <Route path="/customer" element={<Customers userId={userId} isCoach={isCoach} token={token}/>} />
        <Route path="/coaches" element={<Coaches token={token}/>} />
        <Route path="/compatibility" element={<Compatibility isCoach={isCoach} token={token}/>} />
        <Route path="/clothes" element={<Clothes userId={userId} isCoach={isCoach} token={token}/>} />
        <Route path="/tips" element={<Tips isCoach={isCoach} token={token} />} />
        <Route path="/events" element={<Events userId={userId} isCoach={isCoach} token={token} />} />
        <Route path="/create_coach" element={<CreateCoach token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;