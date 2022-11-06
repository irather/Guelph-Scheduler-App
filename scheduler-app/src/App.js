import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';
import { ViewState, EditingState} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2022-11-06';
let meetings = [];
let currentSchedule = [];

function App() {
  const [courseName, findCourseName] = useState("");
  const [returnedCourses,getReturnedCourses] = useState({});
  const [currentCourses,addCourses] = useState([]);
  const [schedulerData,addSchedule] = useState([]);

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
  const addSearchedCourses = async(event) => {
    event.preventDefault();
    if(currentCourses.length < 5) {
      const response = await axios.post('/api/searchCourse', {name: courseName});

      if(response.data == "") {
        alert("Course not found");
      } else {
        getReturnedCourses(response.data);
        addCourses(currentCourses => currentCourses.concat(returnedCourses));
        console.log(response.data);

        meetings = createEventObjs(response.data);
        for(let i = 0;i < meetings.length;i++) {
          addSchedule(schedulerData => schedulerData.concat({ startDate: meetings[i].startDate, endDate: meetings[i].endDate, title: meetings[i].title}))
        }
        console.log("CURRENT SCHED IS");
        console.log(currentSchedule);
      }
    } else {
      alert("beep boop more than 5 coureses added ya can't add anymore");
    }
  }


  //changes the given time to 24 hour time
  const convertTime = (currentTime, dayOrNight) => {
    let tempTime = "";
    let hour = parseInt(currentTime.split(":")[0]);

    //console.log("hour is: " + hour)
    //should be okay for now as long as things don't go pass 10pm
    if(dayOrNight === "PM" && hour < 12) {
      hour += 12;
    } else {
      if(hour < 10) {
        tempTime = "0";
      }
    }

    tempTime = tempTime.concat(hour.toString());
    tempTime = tempTime.concat(":");
    tempTime = tempTime.concat(currentTime.split(":")[1]);
    tempTime = tempTime.concat(":00");

    //console.log("NEW TIME IS " + tempTime);

    return tempTime;
  }

  //sets the schedule time
  const setScheduleTime = (tempMeetingInfo, tempScheuduleObj,day) =>{
    //"2018-10-28" is sunday and for some reason we need to follow it 
    let time = "2022-11-"; //really doesn't matter but needed to set the date pay
    let tempStartTime = "";
    let tempEndTime = "";

    if(day === "Mon") {
      tempStartTime = time.concat("07T" + convertTime(tempMeetingInfo.start_time,tempMeetingInfo.start_type));
      tempEndTime = time.concat("07T" + convertTime(tempMeetingInfo.end_time,tempMeetingInfo.end_type));
    } else if(day === "Tues") {
      tempStartTime = time.concat("08T" + convertTime(tempMeetingInfo.start_time,tempMeetingInfo.start_type));
      tempEndTime = time.concat("08T" + convertTime(tempMeetingInfo.end_time,tempMeetingInfo.end_type));
    } else if(day === "Wed") {
      tempStartTime = time.concat("09T" + convertTime(tempMeetingInfo.start_time,tempMeetingInfo.start_type));
      tempEndTime = time.concat("09T" + convertTime(tempMeetingInfo.end_time,tempMeetingInfo.end_type));
    } else if(day === "Thur") {
      tempStartTime = time.concat("10T" + convertTime(tempMeetingInfo.start_time,tempMeetingInfo.start_type));
      tempEndTime = time.concat("10T" + convertTime(tempMeetingInfo.end_time,tempMeetingInfo.end_type));
    } else if(day === "Fri") {
      tempStartTime = time.concat("11T" + convertTime(tempMeetingInfo.start_time,tempMeetingInfo.start_type));
      tempEndTime = time.concat("11T" + convertTime(tempMeetingInfo.end_time,tempMeetingInfo.end_type));
    }

    console.log("TEMP START TIME IS " + tempStartTime);
    console.log("TEMP START TIME IS " + tempEndTime);

    tempScheuduleObj.startDate = new Date(tempStartTime);
    tempScheuduleObj.endDate = new Date(tempEndTime);
  }

  const createEventObjs = (course) => {
    let meeting = [];
    let tempMeetingInfo = {};
    let days = [];
    let tempScheuduleObj = {};
    let tempName = course.name.split(" ")[0];

    //adding lecturn times
    tempScheuduleObj = {};
    if(course.meeting_info.LEC && Object.keys(course.meeting_info.LEC).length != 0) {
      days = course.meeting_info.LEC.days.trim().split(","); 
      if(Array.isArray(days)) {
        for(let i = 0;i < days.length;i++) {
          tempMeetingInfo = course.meeting_info.LEC;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" LEC");
          //tempScheuduleObj.id = tempName.concat(" LEC-" + i);
          setScheduleTime(tempMeetingInfo,tempScheuduleObj,days[i].trim());
          //tempScheuduleObj.day = days[i].trim();
          meeting.push(tempScheuduleObj);
        }
      } else {
        tempMeetingInfo = course.meeting_info.LEC;
        tempScheuduleObj.title = tempName.concat(" LEC");
        //tempScheuduleObj.id = tempName.concat(" LEC");
        setScheduleTime(tempMeetingInfo,tempScheuduleObj,days);
        //tempScheuduleObj.day = days.trim();
        meeting.push(tempScheuduleObj);
      }
    }

    //exam time
    tempScheuduleObj = {};
    if(course.meeting_info.EXAM && Object.keys(course.meeting_info.EXAM).length != 0) {
      days = course.meeting_info.LEC.days.trim().split(","); 
      if(Array.isArray(days)) {
        for(let i = 0;i < days.length;i++) {
          tempMeetingInfo = course.meeting_info.EXAM;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" EXAM");
          //tempScheuduleObj.id = tempName.concat(" EXAM-" + i);
          setScheduleTime(tempMeetingInfo,tempScheuduleObj,days[i].trim());
          //tempScheuduleObj.type = "error";
          //tempScheuduleObj.day = days[i].trim();
          meeting.push(tempScheuduleObj);
        }
      } else {
        tempMeetingInfo = course.meeting_info.EXAM;
        tempScheuduleObj.title = tempName.concat(" EXAM");
        //tempScheuduleObj.id = tempName.concat(" EXAM");
        setScheduleTime(tempMeetingInfo,tempScheuduleObj,days);
        //tempScheuduleObj.type = "error";
        //tempScheuduleObj.day = days.trim();
        meeting.push(tempScheuduleObj);
      }
    }

    //semester time
    tempScheuduleObj = {};
    if(course.meeting_info.SEM && Object.keys(course.meeting_info.SEM).length != 0) {
      days = course.meeting_info.SEM.days.trim().split(","); 
      if(Array.isArray(days)) {
        for(let i = 0;i < days.length;i++) {
          tempMeetingInfo = course.meeting_info.SEM;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" SEM");
          //tempScheuduleObj.id = tempName.concat(" SEM-" + i);
          setScheduleTime(tempMeetingInfo,tempScheuduleObj,days[i].trim());
          //tempScheuduleObj.day = days[i].trim();
          meeting.push(tempScheuduleObj);
        }
      } else {
        tempMeetingInfo = course.meeting_info.SEM;
        tempScheuduleObj = {};
        tempScheuduleObj.title = tempName.concat(" SEM");
        //tempScheuduleObj.id = tempName.concat(" SEM");
        setScheduleTime(tempMeetingInfo,tempScheuduleObj,days);

        //tempScheuduleObj.day = days.trim();
        meeting.push(tempScheuduleObj);
      }
    }

    //LAB time
    tempScheuduleObj = {};
    if(course.meeting_info.LAB && Object.keys(course.meeting_info.LAB).length != 0) {
      days = course.meeting_info.LAB.days.trim().split(","); 
      if(Array.isArray(days)) {
        for(let i = 0;i < days.length;i++) {
          tempMeetingInfo = course.meeting_info.LAB;
          tempScheuduleObj = {};
          tempScheuduleObj.title = tempName.concat(" LAB");
          //tempScheuduleObj.id = tempName.concat(" LAB-" + i);
          setScheduleTime(tempMeetingInfo,tempScheuduleObj,days[i].trim());
          //tempScheuduleObj.day = days[i].trim();
          meeting.push(tempScheuduleObj);
        }
      } else {
        tempMeetingInfo = course.meeting_info.LAB;
        tempScheuduleObj = {};
        tempScheuduleObj.title = tempName.concat(" LAB");
        //tempScheuduleObj.id = tempName.concat(" LAB");
        setScheduleTime(tempMeetingInfo,tempScheuduleObj,days);

        //tempScheuduleObj.day = days.trim();
        meeting.push(tempScheuduleObj);
      }
    }

    console.log(meeting);
    return(meeting);
  }


  const setSchedule = (meetings) => {
    for(let i = 0;i < meetings.length;i++) {
      if(meetings[i].day == "Mon") {
        currentSchedule.monday.push(meetings[i]);
      } else if(meetings[i].day == "Tues") {
        currentSchedule.tuesday.push(meetings[i]);
      } else if(meetings[i].day == "Wed") {
        currentSchedule.wednesday.push(meetings[i]);
      } else if(meetings[i].day == "Thur") {
        currentSchedule.thursday.push(meetings[i]);
      } else if(meetings[i].day == "Fri") {
        currentSchedule.friday.push(meetings[i]);
      }
    }

    console.log(currentSchedule);
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
        <p>Current course amount is: {currentCourses.length}</p>
        <p>Course selected is: {returnedCourses.name}</p>
        <form class="form-inline" onSubmit={addSearchedCourses}>
          <label class = "form-inline label">
          <p>Course Name:</p>
          <input type="text" name="couresName"placeholder="ex. boop*3090" value={courseName} onChange={(e) => findCourseName(e.target.value)}/>
          </label>
          <input type="submit" />
        </form>
        <Scheduler
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
        </Scheduler>
      </div>
    </div>
  );
}

export default App;
