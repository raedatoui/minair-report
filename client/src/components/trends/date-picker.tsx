import React, { FC } from 'react';
import 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { StyledComponent } from '../../types';

export const DatePicker: FC<StyledComponent> = ({ classes }) => {
    const [selectedDate, setSelectedDate] = React.useState<MaterialUiPickersDate>(new Date());

    const handleDateChange = (date: MaterialUiPickersDate) => {
        setSelectedDate(date);
    };
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                className={classes.datePicker}
                disableToolbar
                autoOk
                variant="inline"
                inputVariant="filled"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Minair Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    );
};
