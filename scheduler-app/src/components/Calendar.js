import React from 'react';
import { ViewState, EditingState, } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

let schedulerData = [];

export function clearSelected() {
  let newData = [];

  for (let i = 0; i < schedulerData.length; i++){
    if (schedulerData[i].selected === false){
      newData.push(schedulerData[i]);
    }
    let el = document.getElementById(schedulerData[i].title + schedulerData[i].startDate);
    el.style.border="none";
  }
  return(newData)
}

const AppointmentContent = (props) => {
    const { style } = props;
  
    return (
      <Appointments.AppointmentContent
        style={{
          ...style,
          color: "black"
        }}
        {...props}
      />
    );
  };
  
const Appointment = ({ children, style, data, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      data={data}
      id={data.title + data.startDate}
      style={{
        ...style,
        backgroundColor: data.backgroundColor,
        border: "none"
      }}
      onClick={(e) => {
        if(e.data.selected){
          for (let i=0; i < schedulerData.length; i++){
            if(schedulerData[i].title.includes(e.data.title.split(" ")[0])){
              schedulerData[i].selected = false;
              let el = document.getElementById(schedulerData[i].title + schedulerData[i].startDate);
              el.style.border="none";
            }
          }
        }
        else{
          for (let i=0; i < schedulerData.length; i++){
            if(schedulerData[i].title.includes(e.data.title.split(" ")[0])){
              schedulerData[i].selected = true;
              let el = document.getElementById(schedulerData[i].title + schedulerData[i].startDate);
              el.style.border="solid";
              el.style.borderColor="#0000ff";
              el.style.borderWidth="3px";
            }
          }
        }
        
      }}
    >
    <a href={data.name} target="_blank" rel="noreferrer">
    {children}
    </a>
    </Appointments.Appointment>
  );

export function Calendar({ data, date, schedule }) {
    schedulerData = data;
    for (let i = 0; i < schedulerData.length; i++){
      schedulerData[i].selected = false;
    }
    return (
      <Scheduler
        data={data}
      >
            <ViewState
                currentDate={date}
            />
            <EditingState
                onCommitChanges={schedule}
            />
            <WeekView
                startDayHour={7}
                endDayHour={24}
            />
            <Appointments appointmentComponent={Appointment}
            appointmentContentComponent={AppointmentContent}/>
        </Scheduler>
    );
}

export default Calendar;