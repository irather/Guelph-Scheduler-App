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
function throwAlert(schedulerData, courseAdded, strict = false) {

  for(let i = 0; i<schedulerData.length; i++) {

    let checkCourse = schedulerData[i];

    if(courseAdded.startDate >= checkCourse.startDate && courseAdded.startDate <= checkCourse.endDate) {
      if(!strict){
        // alert("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      }
      console.log("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      return (true);
    } 
    else if(courseAdded.endDate >= checkCourse.startDate && courseAdded.endDate <= checkCourse.endDate) {
      if(!strict){
        // alert("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      }
      console.log("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      return (true);
    } 
    else if (courseAdded.startDate < checkCourse.startDate && courseAdded.endDate > checkCourse.endDate) {
      if(!strict){
        // alert("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      }
      console.log("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      return (true);
    }
    else if (checkCourse.startDate < courseAdded.startDate && checkCourse.endDate > courseAdded.endDate) {
      if(!strict){
        // alert("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      }
      console.log("Conflict between " + courseAdded.title + " & " + checkCourse.title);
      return (true);
    }

  }
  return(false);

}

module.exports.convertTime = convertTime;
module.exports.throwAlert = throwAlert;
