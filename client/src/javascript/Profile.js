import React, { useEffect, useState} from 'react';
import axios from 'axios';
import '../style/Profile.css';

function Profile({ userId, isCoach, token }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [work, setWork] = useState('');
  const [picture, setPicture] = useState('');

  const userProfile = {
    employee_id: 1,
    email: "GrosBouillaveurDu78@gmail.com",
    nom: "Tristan",
    prenom: "Létargie",
    birthdate: "21/09/2000",
    genre: "AC130",
    travail: "Pupuce",
    image: "DefaultAvatar.png"
  };

  const HandleProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/profile/${userId}`, {
        headers: {
          "token": token
        }
      });
      setEmail(response.data.email);
      setName(response.data.name);
      setSurname(response.data.surname);
      setBirthdate(response.data.birthdate);
      setGender(response.data.gender);
      setWork(response.data.work);
    } catch (error) {
      console.error('Failed to retrieve User Informations');
    }
  }

  const HandlePicture = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/profile/${userId}/image`, {
        headers: {
          "token": token
        }
      });
      setPicture(response.data.picture);
    } catch (error) {
      console.error('Failed tp retrieve the Profile Picture');
    }
  }

  useEffect(() => {
    HandleProfile (userId);
    HandlePicture (userId);
  });

  return (
    <div className="profile-container">
      <h1>Profil Utilisateur</h1>
      <div className="profile-picture">
        <img src={picture || userProfile.image} alt="Avatar"></img>
      </div>
      <div className="profile-info">
        <p><b>Email:</b> {email} </p>
        <p><b>Nom:</b> {name} </p>
        <p><b>Prénom:</b> {surname} </p>
        <p><b>Date de naissance:</b> {birthdate} </p>
        <p><b>Genre:</b> {gender} </p>
        <p><b>Travail:</b> {work} </p>
      </div>
    </div>
  );
}

export default Profile;
