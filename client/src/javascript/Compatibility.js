import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Compatibility.css';

function Compatibility({ isCoach, token }) {
  const [sign1, setSign1] = useState({});
  const [sign2, setSign2] = useState({});
  const [person, setPerson] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [compatibility, setCompatibility] = useState(null);

  const calculateCompatibility = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setCompatibility(Math.floor(Math.random() * 100) + 1);
    }, 3000); // 3 sec
  };

  const resetTest = () => {
    setSign1({});
    setSign2({});
    setShowButton(false);
    setShowAnimation(false);
    setCompatibility(null);
  };

  const HandleCompatibility = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/astro`, {
        headers: {
          "token": token
        }
      });

      setPerson(response.data);
    } catch (error) {
      console.error('Error retrieving the informations about the customers');
    }
  }

  useEffect (() => {
    HandleCompatibility(); 
  }, [])

  return (
    <div className="compatibility-container">
      <header>
        <h1>Compatibility</h1>
      </header>
      <div className="compatibility-main-content">
        <nav className="compatibility-sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!isCoach &&
              <li><Link to="/coaches">Coaches</Link></li>
            }
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/Tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div className="compatibility-dashboard">
          <select className="compatibility-select" value={sign1} onChange={e => { setSign1(e.target.value); setShowButton(e.target.value && sign2); }}>
            <option value="">Select person n°1</option>
            {person.map((sign, index) => <option key={index} value={sign.firstname}>{sign.firstname} {sign.lastname} | {sign.astro_sign}</option>)}
          </select>
          <select className="compatibility-select" value={sign2} onChange={e => { setSign2(e.target.value); setShowButton(sign1 && e.target.value); }}>
            <option value="">Select person n°2</option>
            {person.map((sign, index) => <option key={index} value={sign.firstname}>{sign.firstname} {sign.lastname} | {sign.astro_sign}</option>)}
          </select>
          {showButton && !showAnimation && !compatibility && (
            <button className="compatibility-button" onClick={calculateCompatibility}>Compatibility percentage</button>
          )}
          {showAnimation && <div className="compatibility-animation">Mixing signs...</div>}
          {compatibility && (
            <>
              <div className="compatibility-result">{compatibility}% Compatible</div>
              <button className="compatibility-reset-button" onClick={resetTest}>Reset Test</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compatibility;
