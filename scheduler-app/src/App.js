import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';

function App() {
  const [profileData, setProfileData] = useState("nothing")
  const [response, setResponse] = useState("Response_1")
  const [course, setCourse] = useState("course list empty")
  const [courseDetails, setCourseDetails] = useState("no course detail")
  const [courseName, findCourseName] = useState("");

  // Example endpoint call 
  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      setProfileData(data.name);
    });
  }, []);

  // Example endpoint call 
  useEffect(() => {
    fetch('/api/response_1').then(res => res.json()).then(data => {
      setResponse(data.header);
    });
  }, []);

  // Endpoint call to grab course list
  useEffect(() => {
    fetch('/api/getCourseList').then(res => res.json()).then(data => {
      setCourse(data.list);
    });
  }, []);

  // Endpoint call to grab course details
  useEffect(() => {
    fetch('/api/course/<course>/section/<section>').then(res => res.json()).then(data => {
      setCourseDetails("");
    });
  }, []);

  // Click function to grab specific meetings for specific class
  const handleClick = async () => {
    const response = await axios.get('/api/course/<course>/section/<section>')
    setCourse(JSON.stringify(response.data.course_name_section));
    setCourseDetails(JSON.stringify(response.data.meetings));
  }

  //function to send course name to the backend might not async can be changed to be so
  const sendCourse = async(event) => {
    event.preventDefault();
    const response = await axios.post('/api/GetCouresName', {name: courseName})
    console.log(response);
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
        <form class="form-inline" onSubmit={sendCourse}>
          <label class = "form-inline label">
          <p>Course Name:</p>
          <input type="text" name="couresName"placeholder="ex. CIS*3090" value={courseName} onChange={(e) => findCourseName(e.target.value)}/>
          </label>
          <input type="submit" />
        </form>
        <button onClick={handleClick} type="button" className="btn btn-lg">Change</button>
      </div>
    </div>
  );
}

export default App;
