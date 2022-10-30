import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';

function App() {
  const [currentTime, setCurrentTime] = useState(0)
  const [profileData, setProfileData] = useState("nothing")
  const [response, setResponse] = useState("Response_1")

  //this is how we'll call functions from the flask backend
  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      setProfileData(data.about);
    });
  }, []);

  useEffect(() => {
    fetch('/api/response_1').then(res => res.json()).then(data => {
      setResponse(data.header);
    });
  }, []);

  const handleClick = async () => {
    const response = await axios.get('/api/response_1')
    console.log(JSON.stringify(response));
    setResponse(response.data.body);
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Scheduler</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
              <a className="nav-link" href="#">Example Link</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="home-page">
        <h2>Schedule</h2>
        <p>The bean of the day is {profileData}.</p>
        <p>Welcome to the {response}.</p>

        <button onClick={handleClick} type="button" className="btn btn-lg">Change</button>
      </div>

    </div>
  );
}

export default App;
