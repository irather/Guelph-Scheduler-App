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

function testing() {
    return(1)
}

  module.exports.convertTime = convertTime;
  module.exports.testing = testing;