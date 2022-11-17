import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';
import Calendar from './components/Calendar';

const functions = require("./functions")
const convertTime = functions.convertTime
const throwAlert = functions.throwAlert

const currentDate = '2022-11-06';
let currentSchedule = [];

function App() {
  const [courseName, findCourseName] = useState("");
  const [returnedCourses, getReturnedCourses] = useState({});
  const [currentCourses, addCourses] = useState([]);
  const [schedulerData, addSchedule] = useState([]);

  /*
  // Example endpoint call 
  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      setProfileData(data.name);
    });
  }, []);

  // Click function to grab specific meetings for specific class
  const handleClick = async () => {
    const response = await axios.get('/api/course/<course>/section/<section>')
    setCourse(JSON.stringify(response.data.course_name_section));
    setCourseDetails(JSON.stringify(response.data.meetings));
  }*/


  //function to send course name to the backend might not async can be changed to be so
  const addSearchedCourses = async (event) => {
    event.preventDefault();
    if (currentCourses.length < 5) {
      const response = await axios.post('/api/searchCourse', { name: courseName });

      if (response.data === "") {
        alert("Course not found");
      }
      else {
        getReturnedCourses(response.data);
        addCourses(currentCourses => currentCourses.concat(returnedCourses));
        console.log(response.data);

        const meetings = createEventObjs(response.data);
        for (let i = 0; i < meetings.length; i++) {
          addSchedule(schedulerData => schedulerData.concat({ startDate: meetings[i].startDate, endDate: meetings[i].endDate, title: meetings[i].title,  backgroundColor: meetings[i].backgroundColor}))
        }
        console.log("CURRENT SCHEDULE IS");
        console.log(schedulerData);
      }
    }
    else {
      alert("There are 5 courses already. You cannot add any more courses.");
    }
  }

  //sets the schedule time
  const setScheduleTime = (tempMeetingInfo, tempScheuduleObj, day) => {
    //"2018-10-28" is sunday and for some reason we need to follow it 
    let time = "2022-11-"; //really doesn't matter but needed to set the date day
    let tempStartTime = "";
    let tempEndTime = "";

    if (day === "Mon") {
      tempStartTime = time.concat("07T" + convertTime(tempMeetingInfo.start_time, tempMeetingInfo.start_type));
      tempEndTime = time.concat("07T" + convertTime(tempMeetingInfo.end_time, tempMeetingInfo.end_type));
    }
    else if (day === "Tues") {
      tempStartTime = time.concat("08T" + convertTime(tempMeetingInfo.start_time, tempMeetingInfo.start_type));
      tempEndTime = time.concat("08T" + convertTime(tempMeetingInfo.end_time, tempMeetingInfo.end_type));
    }
    else if (day === "Wed") {
      tempStartTime = time.concat("09T" + convertTime(tempMeetingInfo.start_time, tempMeetingInfo.start_type));
      tempEndTime = time.concat("09T" + convertTime(tempMeetingInfo.end_time, tempMeetingInfo.end_type));
    }
    else if (day === "Thur") {
      tempStartTime = time.concat("10T" + convertTime(tempMeetingInfo.start_time, tempMeetingInfo.start_type));
      tempEndTime = time.concat("10T" + convertTime(tempMeetingInfo.end_time, tempMeetingInfo.end_type));
    }
    else if (day === "Fri") {
      tempStartTime = time.concat("11T" + convertTime(tempMeetingInfo.start_time, tempMeetingInfo.start_type));
      tempEndTime = time.concat("11T" + convertTime(tempMeetingInfo.end_time, tempMeetingInfo.end_type));
    }

    console.log("TEMP START TIME IS " + tempStartTime);
    console.log("TEMP START TIME IS " + tempEndTime);

    tempScheuduleObj.startDate = new Date(tempStartTime);
    tempScheuduleObj.endDate = new Date(tempEndTime);
  }




  // ---------- THIS FUNCTION SHOULD DEFINATELY BE BROKEN DOWN ----------
  const createEventObjs = (course) => {
    let meeting = [];
    let tempMeetingInfo = {};
    let days = [];
    let tempScheuduleObj = {};
    let tempName = course.name.split(" ")[0];

    //adding lecture times
    tempScheuduleObj = {};
    if (course.meeting_info.LEC && Object.keys(course.meeting_info.LEC).length !== 0) {
      days = course.meeting_info.LEC.days.trim().split(",");
      if (Array.isArray(days)) {
        for (let i = 0; i < days.length; i++) {
          tempMeetingInfo = course.meeting_info.LEC;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" LEC");
          setScheduleTime(tempMeetingInfo, tempScheuduleObj, days[i].trim());
          tempScheuduleObj.backgroundColor = "#C6E2FF";
          meeting.push(tempScheuduleObj);
        }
      }
      else {
        tempMeetingInfo = course.meeting_info.LEC;
        tempScheuduleObj.title = tempName.concat(" LEC");
        setScheduleTime(tempMeetingInfo, tempScheuduleObj, days);
        tempScheuduleObj.backgroundColor = "#C6E2FF";
        meeting.push(tempScheuduleObj);
      }
    }

    throwAlert(schedulerData, tempScheuduleObj);

    //exam time
    tempScheuduleObj = {};
    if (course.meeting_info.EXAM && Object.keys(course.meeting_info.EXAM).length !== 0) {
      days = course.meeting_info.LEC.days.trim().split(",");
      if (Array.isArray(days)) {
        for (let i = 0; i < days.length; i++) {
          tempMeetingInfo = course.meeting_info.EXAM;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" EXAM");
          setScheduleTime(tempMeetingInfo, tempScheuduleObj, days[i].trim());
          tempScheuduleObj.backgroundColor = "#008080";
          meeting.push(tempScheuduleObj);
        }
      }
      else {
        tempMeetingInfo = course.meeting_info.EXAM;
        tempScheuduleObj.title = tempName.concat(" EXAM");
        setScheduleTime(tempMeetingInfo, tempScheuduleObj, days);
        tempScheuduleObj.backgroundColor = "#008080";
        meeting.push(tempScheuduleObj);
      }
    }

    throwAlert(schedulerData, tempScheuduleObj);

    //semester time
    tempScheuduleObj = {};
    if (course.meeting_info.SEM && Object.keys(course.meeting_info.SEM).length !== 0) {
      days = course.meeting_info.SEM.days.trim().split(",");

      if (Array.isArray(days)) {
        for (let i = 0; i < days.length; i++) {
          tempMeetingInfo = course.meeting_info.SEM;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" SEM");
          setScheduleTime(tempMeetingInfo, tempScheuduleObj, days[i].trim());
          tempScheuduleObj.backgroundColor = "#FF7373";
          meeting.push(tempScheuduleObj);
        }
      }
      else {
        tempMeetingInfo = course.meeting_info.SEM;
        tempScheuduleObj = {};
        tempScheuduleObj.title = tempName.concat(" SEM");
        setScheduleTime(tempMeetingInfo, tempScheuduleObj, days);
        tempScheuduleObj.backgroundColor = "#FF7373";
        meeting.push(tempScheuduleObj);
      }
    }

    throwAlert(schedulerData, tempScheuduleObj);

    //LAB time
    tempScheuduleObj = {};
    if (course.meeting_info.LAB && Object.keys(course.meeting_info.LAB).length !== 0) {
      days = course.meeting_info.LAB.days.trim().split(",");

      if (Array.isArray(days)) {
        for (let i = 0; i < days.length; i++) {
          tempMeetingInfo = course.meeting_info.LAB;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" LAB");
          setScheduleTime(tempMeetingInfo, tempScheuduleObj, days[i].trim());
          tempScheuduleObj.backgroundColor = "#B0E0E6";
          meeting.push(tempScheuduleObj);
        }
      }
      else {
        tempMeetingInfo = course.meeting_info.LAB;
        tempScheuduleObj = {};
        tempScheuduleObj.title = tempName.concat(" LAB");
        setScheduleTime(tempMeetingInfo, tempScheuduleObj, days);
        tempScheuduleObj.backgroundColor = "#B0E0E6";
        meeting.push(tempScheuduleObj);
      }
    }

    throwAlert(schedulerData, tempScheuduleObj);

    console.log(meeting);
    return (meeting);
  }

  const populateList = async (e) => {
    const response = await axios.post('/api/search10Courses', { name: courseName });
    document.getElementById("searchDropdown").innerHTML = ""
    document.getElementById("searchDropdown").style.display = "none"

    if (courseName !== "" && response.data[0] !== null) {
      document.getElementById("searchDropdown").style.display = "block"
      for (let i = 0; i < response.data.length; i++) {
        document.getElementById("searchDropdown").innerHTML += "<p>" + response.data[i].name + "<p>"
      }
    }

  }

  function dropdownVisibility(visibility) {
    if (courseName !== "") {
      document.getElementById("searchDropdown").style.display = visibility
    }
  }

  const removeCourses = async () => {
    console.log("I HAVE BEEN CLICKED :CCCC");
    addSchedule([]);
    addCourses([]);
    console.log(schedulerData);
  }


  return (
    <div>
      <div className="home-page">
        <header>Schedule</header>

        <aside className="aside info">
          <p>Courses in schedule:{currentCourses.length}</p>
          <p>Course Selected: {returnedCourses.name}</p>
        </aside>

        <aside className="aside search">
          <form className="form-inline" onSubmit={addSearchedCourses}>
            <label className="form-inline label">
              <p>Course Name:</p>
              <div>
                <input className="searchBar" type="text" name="couresName" placeholder="ex. CIS*1300" value={courseName} 
                  onChange={(e) => findCourseName(e.target.value)} onKeyUp={(e) => populateList(e)} 
                  onFocus={(e) => dropdownVisibility("block")} onBlur={(e) => dropdownVisibility("none")}
                />
                <div id="searchDropdown" className="dropdown-content">
                </div>
              </div>
            </label>
            <button type="submit" class="button">Find</button>
          </form>
          <button type="button" class="button" onClick={removeCourses}>Clear</button>
        </aside>

        {/*<Scheduler
          data={schedulerData}
        >
          <ViewState
            currentDate={currentDate}
          />
          <EditingState
            onCommitChanges={currentSchedule}
          />
          <WeekView
            startDayHour={7}
            endDayHour={24}
          />
          <Appointments />
  </Scheduler>*/}
        <Calendar data={schedulerData} date={currentDate} schedule={currentSchedule} />
        <div class="footer">
          <p>Made with pain, sweat, tear and the screams of damned</p>
        </div>
      </div>
    </div>
  );
}

export default App;
