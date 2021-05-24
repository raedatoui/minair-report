import React, { FC } from 'react';
import 'date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { StyledComponent } from '../../types';

interface Props extends StyledComponent {
    selectedDate: string | null,
    setSelectedDate: (date: string | null) => void
}

const DatePickerWrapper: FC<Props> = ({ classes, selectedDate, setSelectedDate }) => {
    const handleDateChange = (date: MaterialUiPickersDate) => {
        setSelectedDate(date?.toISOString().split(':')[0].split('T')[0] ?? null);
    };
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                className={classes.datePicker}
                disableToolbar
                autoOk
                variant="inline"
                inputVariant="filled"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Minair Date"
                value={selectedDate ?? new Date()}
                onChange={handleDateChange}
                minDate="2021-03-22"
                maxDate={new Date()}
            />
        </MuiPickersUtilsProvider>
    );
};

export default DatePickerWrapper;
