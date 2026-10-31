import React, { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StyledComponent } from '../../types';

interface Props extends StyledComponent {
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
}

const DatePickerWrapper: FC<Props> = ({ classes, selectedDate, setSelectedDate }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            className={classes.datePicker}
            label="Minair Date"
            format="MM/dd/yyyy"
            value={selectedDate ? parseISO(selectedDate) : new Date()}
            onChange={date => {
                if (!date || !Number.isNaN(date.getTime())) setSelectedDate(date ? format(date, 'yyyy-MM-dd') : null);
            }}
            minDate={new Date(2021, 2, 22)}
            maxDate={new Date()}
            closeOnSelect
            slotProps={{ toolbar: { hidden: true }, textField: { variant: 'filled', margin: 'normal', id: 'date-picker-inline' } }}
        />
    </LocalizationProvider>
);

export default DatePickerWrapper;
