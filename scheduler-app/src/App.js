import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0)
  const [profileData, setProfileData] = useState("nothing")

  //this is how we'll call functions from the flask backend
  useEffect(() => {
    fetch('/profile').then(res => res.json()).then(data => {
      setProfileData(data.name);
    });
  }, []);

  return (
    <div className="home-page">
      <h1>Scheduler</h1>
      <h2>Schedule</h2>
      <p>The bean of the day is {profileData}.</p>
    </div>
  );
}

export default App;
