import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/CreateCoaches.css';

function CreateCoach({ token }) {
  const [formValues, setFormValues] = useState({
    email: '',
    firstname: '',
    lastname: '',
    gender: '',
    birthdate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const addCoaches = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/employee/coach`, {
        "email": formValues.email,
        "firstname": formValues.firstname,
        "lastname": formValues.lastname,
        "gender": formValues.gender,
        "birth_date": formValues.birthdate,
      }, {
        headers: {
          "token": token
        }
      });
      setFormValues({
        email: '',
        firstname: '',
        lastname: '',
        gender: '',
        birthdate: ''
      });
      alert('Coach added successfully!');
    } catch (error) {
      console.error('Error Adding a coach');
    }
  };

  return (
    <div className="create-coach-container">
      <h1>Create a New Coach</h1>
      <form onSubmit={addCoaches}>
        <label>Email:
          <input 
            name='email' 
            type='email' 
            value={formValues.email} 
            onChange={handleInputChange} 
            placeholder=" coach's email"
            required  
          />
        </label>
        <br />
        <label>Firstname:
          <input 
            name='firstname' 
            type='text' 
            value={formValues.firstname} 
            onChange={handleInputChange} 
            placeholder=" coach's firstname"
            required  
          />
        </label>
        <br />
        <label>Lastname:
          <input 
            name='lastname' 
            type='text' 
            value={formValues.lastname} 
            onChange={handleInputChange} 
            placeholder=" coach's lastname"
            required  
          />
        </label>
        <br />
        <label>Gender:
          <input 
            type='radio' 
            name='gender' 
            value="Male" 
            checked={formValues.gender === 'Male'} 
            onChange={handleInputChange} 
            required  
          />Male
          <input 
            type='radio' 
            name='gender' 
            value="Female" 
            checked={formValues.gender === 'Female'} 
            onChange={handleInputChange}
            required  
          />Female
          <input 
            type='radio' 
            name='gender' 
            value="Other" 
            checked={formValues.gender === 'Other'} 
            onChange={handleInputChange}
            required  
          />Other
        </label>
        <br />
        <label>Birthdate:
          <input 
            name='birthdate' 
            type='date' 
            value={formValues.birthdate} 
            onChange={handleInputChange} 
            required 
          />
        </label>
        <br />
        <button type='submit'>Submit</button>
      </form>
      <br />
      <Link to="/coaches">
        <button className="back-button">Back to Coaches</button>
      </Link>
    </div>
  );
}

export default CreateCoach;
