import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import '../style/Events.css'

function Events({ userId, isCoach, token }) {
  const [zoom, setZoom] = useState(16);
  const [events, setEvents] = useState([]);
  const [mapCenter, setMapCenter] = useState([48.69883069689091, 2.2930671533863634]);

  const handleEventClick = (coords) => {
    setMapCenter(coords);
    setZoom(14);
  };

  const handleKeyDown = (event, coords) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleEventClick(coords);
    }
  };

  const handleEvents = async () => {
    try {
      if (isCoach) {
        const response = await axios.get(`http://localhost:5000/event/${userId}`, {
          headers: {
            "token": token
          }
        });
        setEvents(response.data);
        setMapCenter([response.data[0].location_x, response.data[0].location_y]);
      } else {
        const response = await axios.get(`http://localhost:5000/event`, {
          headers: {
            "token": token
          }
        });
        setEvents(response.data);
        setMapCenter([response.data[0].location_x, response.data[0].location_y]);
      }
    } catch (error) {
      console.error('Error retrieving the events');
    }
  }

  useEffect(() => {
    handleEvents();
  }, [])
  
  // useEffect(() => {
  //   if (events.length > 0) {
  //     setMapCenter([events[0].location_x, events[0].location_y]);
  //   } else {
  //     setMapCenter([0.0, 0.0]);
  //   }
  // }, [events]);

  return (
    <div className="events-container">
      <header>
        <h1>Events</h1>
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
        <div className="events-dashboard">
          <div className="map-container">
            <Map center={mapCenter} zoom={zoom} width={965} height={900} animate={true}>
              <ZoomControl />
              {events.map((event, index) => (
                <Marker key={index} anchor={[event.location_x, event.location_y]} payload={event.event_id} onClick={() => handleEventClick([event.location_x, event.location_y])} />
              ))}
            </Map>
          </div>
          <div className="events-list">
            {events.map((event, index) => (
              <div className="event-item" tabIndex="0" key={index}
                onClick={() => handleEventClick([event.location_x, event.location_y])}
                onKeyDown={(e) => handleKeyDown(e, [event.location_x, event.location_y])}>
                <h3>{event._name}</h3>
                <p>Date: {event._date}</p>
                <p>Location: {event.location_name}</p>
                <p>Participants: {event.max_participants}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
