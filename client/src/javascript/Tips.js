import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Tips.css';

function Tips({ isCoach, token }) {
  const [tips, setTips] = useState([]);

  const handleTips = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tip`, {
        headers: {
          "token": token
        }
      });
      setTips(response.data);
    } catch (error) {
      console.error('Error retrieving the tips');
    }
  }

  useEffect (() => {
    handleTips();
  }, [])

  return (
    <div className="tips-container">
      <header>
        <h1>Tips</h1>
      </header>
      <div className="main-content">
        <nav className="sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!isCoach && 
              <li><Link to="/coaches">Coaches</Link></li>
            }
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div className="tips-dashboard">
          {tips.map((tip, index) => (
            <div className="tip-item" tabIndex="0" key={index} role="button" aria-label={`Tip number ${index + 1}`}>
              <b>{tip.title}</b>
              <br></br>
              <p>{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tips;
