import React, {useState, useEffect} from 'react';
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
    <div>
      <h1>
        Scheduler
      </h1>

      <div>
        <h2>Schedule</h2>
      </div>
      <p>The bean of the day is {profileData}.</p>

    </div>
  );
}

export default App;
