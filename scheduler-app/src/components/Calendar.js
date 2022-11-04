import React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';

function Calendar() {
    return (
        <Paper>
            <Scheduler height={400} width={500}>
                <WeekView startDayHour={9} endDayHour={19} />
            </Scheduler>
        </Paper>
    );
}

export default Calendar;