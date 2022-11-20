import React from 'react';
import { ViewState, EditingState, } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';



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
      style={{
        ...style,
        backgroundColor: data.backgroundColor
      }}
    >
      {children}
    </Appointments.Appointment>
  );

function Calendar({ data, date, schedule }) {
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