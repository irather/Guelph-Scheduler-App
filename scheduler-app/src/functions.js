function convertTime (currentTime, dayOrNight) {
  let tempTime = "";
  let hour = parseInt(currentTime.split(":")[0]);

  //should be okay for now as long as things don't go pass 10pm
  if(dayOrNight === "PM" && hour < 12) {
    hour += 12;
  } 
  else {
    if(hour < 10) {
      tempTime = "0";
    }
  }

  tempTime = tempTime.concat(hour.toString());
  tempTime = tempTime.concat(":");
  tempTime = tempTime.concat(currentTime.split(":")[1]);
  tempTime = tempTime.concat(":00");

  return tempTime;
}



// gives an alert and returns true if there is a conflict
function throwAlert(schedulerData, courseAdded) {

  for(let i = 0; i<schedulerData.length; i++) {

    let checkCourse = schedulerData[i];

    if(courseAdded.startDate >= checkCourse.startDate && courseAdded.startDate <= checkCourse.endDate) {
      return (true);
    } 
    else if(courseAdded.endDate >= checkCourse.startDate && courseAdded.endDate <= checkCourse.endDate) {
      return (true);
    } 
    else if (courseAdded.startDate < checkCourse.startDate && courseAdded.endDate > checkCourse.endDate) {
      return (true);
    }
    else if (checkCourse.startDate < courseAdded.startDate && checkCourse.endDate > courseAdded.endDate) {
      return (true);
    }

  }
  return(false);

}

//returning true if the course is outside of preferences
function checkPreferences(preferences, courseAdded) {
  let textDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  let dateDays = ["06T", "07T", "08T", "09T", "10T", "11T", "12T"]
  //check that the course added doesn't occur on the preferences.weekDays
  for (let i = 0; i < preferences.weekDays.length; i++){
    if(textDays[courseAdded.startDate.getDay()] === preferences.weekDays[i].name){
      return(true);
    }
  }

  //check that the course added occurs outside the timeOfDay
  let timePreferences = [];
  let time = "2022-11-";
  let morning = {
    startDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "08:00:00")),
    endDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "11:59:59")),
    name: "morning"
  };
  let afternoon = {
    startDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "12:00:00")),
    endDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "16:59:59")),
    name: "afternoon"
  };
  let evening = {
    startDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "17:00:00")),
    endDate: new Date (time.concat(dateDays[courseAdded.startDate.getDay()] + "21:59:59")),
    name: "evening"
  };

  for (let i = 0; i < preferences.timeOfDay.length; i++){
    // var index = timePreferences.findIndex(obj => obj.name === preferences.timeOfDay[i].name);
    // timePreferences.splice(index, 1);
    if(preferences.timeOfDay[i].name === "morning"){
      timePreferences.push(morning);
    }
    else if(preferences.timeOfDay[i].name === "afternoon"){
      timePreferences.push(afternoon);
    }
    else if(preferences.timeOfDay[i].name === "evening"){
      timePreferences.push(evening);
    }
  }
  return(throwAlert(timePreferences, courseAdded))
}

module.exports.convertTime = convertTime;
module.exports.throwAlert = throwAlert;
module.exports.checkPreferences = checkPreferences;
