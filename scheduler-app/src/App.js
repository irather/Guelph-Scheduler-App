import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';

function App() {
  const [profileData, setProfileData] = useState("nothing")
  const [response, setResponse] = useState("Response_1")
  const [course, setCourse] = useState("course list empty")
  const [courseDetails, setCourseDetails] = useState("no course detail")

  //this is how we'll call functions from the flask backend
  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      setProfileData(data.name);
    });
  }, []);

  useEffect(() => {
    fetch('/api/response_1').then(res => res.json()).then(data => {
      setResponse(data.header);
    });
  }, []);

  useEffect(() => {
    fetch('/api/getCourseList').then(res => res.json()).then(data => {
      setCourse(data.list);
    });
  }, []);

  useEffect(() => {
    fetch('/api/course/<course>/section/<section>').then(res => res.json()).then(data => {
      setCourseDetails("");
    });
  }, []);

  const handleClick = async () => {
    const response = await axios.get('/api/course/<course>/section/<section>')
    setCourse(JSON.stringify(response.data.course_name_section));
    setCourseDetails(JSON.stringify(response.data.meetings));
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
        <p>Here is a list of courses: {course}</p>
        <p>Here are the course details: {courseDetails}</p>

        <button onClick={handleClick} type="button" className="btn btn-lg">Change</button>
      </div>

    </div>
  );
}

export default App;
