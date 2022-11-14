import React from 'react';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

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
            <Appointments />
        </Scheduler>
    );
}

export default Calendar;