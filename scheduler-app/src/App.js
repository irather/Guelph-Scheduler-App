import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from 'axios';
import Calendar from './components/Calendar';
import Popup from './components/Popup';

const functions = require("./functions")
const convertTime = functions.convertTime
const throwAlert = functions.throwAlert

const currentDate = '2022-11-06';
let currentSchedule = [];
let F22sem = [];
let W23sem = [];
let F22entered = 0;
let W23entered = 0;
let F22current = [];
let W23current = [];
let currentSemester = 1;
function App() {
  const [courseName, findCourseName] = useState("");
  const [returnedCourses, getReturnedCourses] = useState({});
  const [currentCourses, addCourses] = useState([]);
  const [schedulerData, addSchedule] = useState([]);
  const [semester, findSemester] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errorCourse, setErrorCourse] = useState([]);
  const [enteredCourses,setEntered] = useState(0);

  
  async function semesterButtonClicked (e) {
    //save the data from the current semester
    if(semester === "F22"){
      F22current = currentCourses;
      F22sem = schedulerData;
      F22entered = enteredCourses;
      currentSemester = 0;
    }
    else {
      W23current = currentCourses;
      W23sem = schedulerData;
      W23entered = enteredCourses;
      currentSemester = 1;
    }

    //swap the scheduler data to the clicked semester
    if(e.target.value === "F22"){
      setEntered(F22entered);
      addSchedule(F22sem);
      addCourses(F22current);
    }
    else if(e.target.value === "W23"){
      setEntered(W23entered);
      addSchedule(W23sem);
      addCourses(W23current);
    }

    //update the semester variable to the one that was clicked
    findSemester(e.target.value);
  }

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


  const saveCourses = async () => {
    //call this function first to save any of the currently entered courses to the F22current and W23current object this will cause errors and complain b/c e isnt being sent as a param but should work as intended
    semesterButtonClicked();

    let f22Courses = JSON.stringify(F22sem);
    let f22Cur =  JSON.stringify(F22current);
    let f22Enter = F22entered;
    let w23Courses = JSON.stringify(W23sem);
    let w23Cur =  JSON.stringify(W23current);
    let w23Enter = W23entered;

    //stores the variables into local storage
    localStorage.setItem("F22",f22Courses);
    localStorage.setItem("f22Cur",f22Cur);
    localStorage.setItem("f22Enter",f22Enter);
    localStorage.setItem("W23",w23Courses);
    localStorage.setItem("w23Cur",w23Cur);
    localStorage.setItem("w23Enter",w23Enter);

    //this can use the in house component later
    alert("Courses have been saved!");
  }

  const loadCourses = async () => {
    //pulls the info from local storage
    let f22Courses = JSON.parse(localStorage.getItem("F22"));
    let f22Cur =  JSON.parse(localStorage.getItem("f22Cur"));
    let f22Enter = parseInt(localStorage.getItem("f22Enter"));
    let w23Courses = JSON.parse(localStorage.getItem("W23"));
    let w23Cur =  JSON.parse(localStorage.getItem("w23Cur"));
    let w23Enter = parseInt(localStorage.getItem("w23Enter"));

    //replace the current value with the stored one
    F22current = f22Cur;
    F22sem = f22Courses;
    F22entered = f22Enter;
    W23current = w23Cur;
    W23sem = w23Courses;
    W23entered = w23Enter;

    //sets the currently viewed schedule accordingly
    //W23
    if(currentSemester === 1) {
      setEntered(W23entered);
      addSchedule(W23sem);
      addCourses(W23current);
    } else {
      setEntered(F22entered);
      addSchedule(F22sem);
      addCourses(F22current);
    }

    alert("Courses have been loaded!");
  }

  //function to send course name to the backend might not async can be changed to be so
  const addSearchedCourses = async (event) => {
    event.preventDefault();
    console.log("LEGNTH IS");
    console.log(currentCourses.length);
    if (currentCourses.length < 5) {
      const response = await axios.post('/api/searchCourse', { name: courseName, sem: semester});

      if (response.data === "") {
        alert("Course not found");
      }
      else {
        getReturnedCourses(response.data);
        addCourses(currentCourses => currentCourses.concat(returnedCourses));
        setEntered(enteredCourses => enteredCourses + 1);
        console.log(response.data);

        const meetings = createEventObjs(response.data, schedulerData);
        for (let i = 0; i < meetings.length; i++) {
          await addSchedule(schedulerData => schedulerData.concat({ startDate: meetings[i].startDate, endDate: meetings[i].endDate, title: meetings[i].title,  backgroundColor: meetings[i].backgroundColor, suggested: false,name: meetings[i].name}))
        }
        console.log("CURRENT SCHEDULE IS");
        console.log(schedulerData);
      }
      findCourseName("")
    }
    else {
      alert("There are 5 courses already. You cannot add any more courses.");
    }

    console.log("CURRENT COURSES");
    console.log(currentCourses);
  }

  //sets the schedule time
  const setScheduleTime = (tempMeetingInfo, tempScheduleObj, day) => {
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

    tempScheduleObj.startDate = new Date(tempStartTime);
    tempScheduleObj.endDate = new Date(tempEndTime);
  }


  const createEventObjs = (course, data, strict = false, suggested = false) => {
    let meeting = [];
    let tempMeetingInfo = {};
    let days = [];
    let tempScheduleObj = {};
    let tempName = course.name.split(" ")[0];
    let tempBaseName = "https://calendar.uoguelph.ca/search/?P=" + tempName.split("*")[0].concat("*" +tempName.split("*")[1])
    let isConflict = false;
    let suggestTag = "";

    let colours = {};
    if (suggested){
      colours = {
        LEC: "#FFED96",
        EXAM: "#56FF6A",
        SEM: "#FFA366",
        LAB: "#D4FF68"
      }
      suggestTag = " SUGGESTED"
    }
    else {
      colours = {
        LEC: "#C6E2FF",
        EXAM: "#008080",
        SEM: "#FF7373",
        LAB: "#38D1E2"
      }
    }

    let keys = Object.keys(course.meeting_info)
    
    for (let i in keys){
      if (course.meeting_info[keys[i]].days !== undefined) {
        days = course.meeting_info[keys[i]].days.trim().split(",");
        if (Array.isArray(days)) {
          for (let j = 0; j < days.length; j++) {
            tempMeetingInfo = course.meeting_info[keys[i]];
            tempScheduleObj = {};
            tempScheduleObj.title = tempName.concat(" " + keys[i] + suggestTag);
            tempScheduleObj.name = tempBaseName;
            setScheduleTime(tempMeetingInfo, tempScheduleObj, days[j].trim());
            tempScheduleObj.backgroundColor = colours[keys[i]];
            if(!throwAlert(data, tempScheduleObj, strict) ||!strict) {
              meeting.push(tempScheduleObj);
            }
            else {
              isConflict = true;
            }

            if(throwAlert(data, tempScheduleObj, strict) === true && !strict) {
              setErrorCourse(course.name);
              setIsOpen(!isOpen);
            }
          }
        }
        else {
          tempMeetingInfo = course.meeting_info.LEC;
          tempScheduleObj.title = tempName.concat(" " + keys[i] + suggestTag);
          tempScheduleObj.name = tempBaseName;
          setScheduleTime(tempMeetingInfo, tempScheduleObj, days);
          tempScheduleObj.backgroundColor = colours[keys[i]];
          if(!throwAlert(data, tempScheduleObj, strict) ||!strict) {
            meeting.push(tempScheduleObj);
          }
          else {
            isConflict = true;
          }

          if(throwAlert(data, tempScheduleObj, strict) === true && !strict) {
            setErrorCourse(course.name);
            setIsOpen(!isOpen);
          }
        }
      }
    }
    if (isConflict && strict){
      meeting = []
    }
    return (meeting);
    
  }

  

  async function dropDownElementClicked (course) {
    document.getElementById("searchBar").value = course
    findCourseName(course)
  }

  async function populateList(amount = "10"){
    const response = await axios.post("/api/search" + amount + "Courses", { name: courseName, sem: semester});
    
    //clear and hide dropdown
    while (document.getElementById("searchDropdown").firstChild) {
      document.getElementById("searchDropdown").removeChild(document.getElementById("searchDropdown").lastChild);
    }
    document.getElementById("searchDropdown").style.display = "none"

    //add the courses that match the courseName
    if (courseName !== "" && response.data[0] !== null) {
      document.getElementById("searchDropdown").style.display = "block"

      for (let i = 0; i < response.data.length; i++) {
        const newDiv = document.createElement("div")
        newDiv.innerText = response.data[i].name
        newDiv.onclick = () => {
          dropDownElementClicked(response.data[i].name)
        }
        document.getElementById("searchDropdown").appendChild(newDiv)
      }
      //add button for listing all searched courses
      if(amount !== "All") {
        const newA = document.createElement("a")
        newA.innerText = "Show all matching courses"
        newA.onclick = () => {
          populateList(amount = "All")
        }
        newA.style.color = 'blue'
        document.getElementById("searchDropdown").appendChild(newA)
      }
    }

  }

  function dropdownVisibility(visibility) {
    if (courseName !== "") {
      document.getElementById("searchDropdown").style.display = visibility
    }
  }

  const removeCourses = async () => {
    addSchedule([]);
    addCourses([]);
    setEntered(0);
  }

  const suggestCourses = async (e) => {
    const response = await axios.post('/api/searchAllCourses', { name: courseName, sem: semester});
    let j = 0;
    let tempScheduleData = []
    let numCourses = currentCourses.length
    for (let k in schedulerData) {
      tempScheduleData.push(schedulerData[k])
    }
    //copy over schedulerData to tempScheduleData with a for loop
    while (numCourses < 5 && j < response.data.length){
      getReturnedCourses(response.data[j]);
      addCourses(current => current.concat(returnedCourses));
      const meetings = createEventObjs(response.data[j], tempScheduleData, true, true);
      if(meetings.length !== 0){
        numCourses++;
      }
      for (let i = 0; i < meetings.length; i++) {
        tempScheduleData.push({ startDate: meetings[i].startDate, endDate: meetings[i].endDate, title: meetings[i].title,  backgroundColor: meetings[i].backgroundColor});
        addSchedule(schedulerData => schedulerData.concat({ startDate: meetings[i].startDate, endDate: meetings[i].endDate, title: meetings[i].title,  backgroundColor: meetings[i].backgroundColor, suggested: true}))
      }
      //console.log(tempScheduleData)
      j++;
    }
    setEntered(numCourses);

  }

  const clearSuggested =  () => {
    //filters out courses that have suggested = true
    addSchedule(current => current.filter(schedulerData =>{
      return schedulerData.suggested === false;
    }));

    //clear the add courses array and fills it in with dummy data, we only really use its length to determine how many courses are selected
    addCourses([]);
    console.log(enteredCourses);
    for (let i = 0; i < enteredCourses; i++) {
      addCourses(current => current.concat({test:"hi"}));
    }
  }


  return (
    <div>

      <div className="row">
          {/* Popup */}
          <div>
            {isOpen && <Popup 
              handleClose={() => { setIsOpen(!isOpen) }}
              content={<div>
                  <h3>ERROR - Course Conflict</h3>
                  <p>There is a conflict with {errorCourse}</p>
                </div>}
            />} 
          </div>  
      </div>

      <div className="home-page">

        <header>
          <h1>Course Scheduler</h1>
        </header>

        <aside className="aside search">
          <form className="form-inline" onSubmit={addSearchedCourses}>

              <div className="row form-box" class="yellow-bg">
                
                <div className="col form-col">
                  {/* Days Off */}
                  <fieldset className="suggestions">
                    <aside>
                      <legend>Choose the day off:</legend>
                      <input type="checkbox" id="monday" name="monday"></input>
                      <label htmlFor="monday"> Monday</label>
                      <br></br>
                      <input type="checkbox" id="tuesday" name="tuesday"></input>
                      <label htmlFor="tuesday"> Tuesday</label>
                      <br></br>              
                      <input type="checkbox" id="wednesday" name="wednesday"></input>
                      <label htmlFor="wednesday"> Wednesday</label>
                      <br></br>              
                      <input type="checkbox" id="thursday" name="thursday"></input>
                      <label htmlFor="thursday"> Thursday</label>
                      <br></br>            
                      <input type="checkbox" id="friday" name="friday"></input>
                      <label htmlFor="friday"> Friday</label>
                      <br></br>            
                      <input type="checkbox" id="saturday" name="saturday"></input>
                      <label htmlFor="saturday"> Saturday</label>
                      <br></br>            
                      <input type="checkbox" id="sunday" name="sunday"></input>
                      <label htmlFor="sunday"> Sunday</label>
                    </aside>
                  </fieldset>
                </div>

                <div className="col form-col">
                  {/* Time Preference */}
                  <fieldset className="suggestions">
                    <aside>
                      <legend>Time of Day Preference</legend>
                      <input type="checkbox" id="morning" name="morning"></input>
                      <label htmlFor="morning"> morning</label>
                      <br></br>
                      <input type="checkbox" id="afternoon" name="afternoon"></input>
                      <label htmlFor="afternoon"> afternoon</label>
                      <br></br> 
                      <input type="checkbox" id="evening" name="evening"></input>
                      <label htmlFor="evening"> evening</label>
                      <br></br> 
                    </aside>
                  </fieldset>
                </div>

                <div className="col form-col">
                  {/* Suggested button */}
                  <div className="suggestedButtons">
                    <div class="row">
                      <button type="button" className="button" onClick={suggestCourses}>Suggest Courses</button>
                    </div>

                    <div class="row">
                      <button type="button" className="button" onClick={clearSuggested}>Clear Suggested Courses</button>
                    </div>
                  </div>
                </div>

              </div>

            <div className="form-box">
              {/* Semester preference */}
              <div className="form-inline label row">
                <div className="col">
                  <div className="semester-choice">
                    <fieldset className="fieldset">
                    <legend>Semester choice:</legend>
                      <input type="radio" id="F22" name="fav_language" value="F22" onClick={(e) => semesterButtonClicked(e)}></input>
                          <label htmlFor="F22">F22</label>
                      <input type="radio" id="W23" name="fav_language" defaultChecked="true" value="W23" onClick={(e) => semesterButtonClicked(e)}></input>
                          <label htmlFor="W23">W23</label>
                    </fieldset>
                  </div>
                </div>
                  
                <div className="col">
                  <p>Course Name:</p>
                  <div tabIndex={"100"}
                      onFocus={(e) => dropdownVisibility("block")} onBlur={(e) => dropdownVisibility("none")}>
                    <input id="searchBar" className="searchBar" type="text" name="couresName" placeholder="ex. CIS*1300" value={courseName} 
                      onChange={(e) => findCourseName(e.target.value)} onKeyUp={(e) => {populateList()}}
                    />
                    <div id="searchDropdown" className="dropdown-content">
                    </div>
                  </div>
                  <button type="submit" className="button">Find</button>
                  <button type="button" className="button" onClick={removeCourses}>Clear</button>

                  <button type="button" className="button" onClick={saveCourses}>Save</button>
                  <button type="button" className="button" onClick={loadCourses}>Load</button>
                </div>
              </div>
            </div>

          </form>
        </aside>
        <Calendar data={schedulerData} date={currentDate} schedule={currentSchedule} />
        <div className="footer">
          <p>Made with pain, sweat, tear and the screams of damned</p>
        </div>
      </div>
    </div>
  );
}

export default App;
