import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import AgendaHeader from './AgendaHeader';
import EventDialog from './EventDialog';
import reducer from '../store';
import {
  getEvents,
  selectEvents,
  openNewEventDialog,
  openEditEventDialog,
} from '../store/agendaSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'normal!important',
    },
    '&  .fc-media-screen': {
      minHeight: '100%',
    },
    '& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
      borderColor: `${theme.palette.divider}!important`,
    },
    '&  .fc-scrollgrid-section > td': {
      border: 0,
    },
    '& .fc-daygrid-day': {
      '&:last-child': {
        borderRight: 0,
      },
    },
    '& .fc-col-header-cell': {
      borderWidth: '0 0 1px 0',
      padding: '16px 0',
      '& .fc-col-header-cell-cushion': {
        color: theme.palette.text.secondary,
        fontWeight: 500,
      },
    },
    '& .fc-view ': {
      borderRadius: 20,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`,
      '& > .fc-scrollgrid': {
        border: 0,
      },
    },
    '& .fc-daygrid-day-number': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
    '& .fc-event': {
      backgroundColor: `${theme.palette.primary.dark}!important`,
      color: `${theme.palette.primary.contrastText}!important`,
      border: 0,
      padding: '0 6px',
      borderRadius: '16px!important',
    },
  },
  addButton: {
    position: 'absolute',
    right: 12,
    top: 172,
    zIndex: 99,
  },
}));

function renderEventContent(eventInfo) {
  return (
    <div className="flex items-center">
      <Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
      <Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
    </div>
  );
}

const AgendaPage = (props) => {
  const [currentDate, setCurrentDate] = useState();
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const calendarRef = useRef();

  const classes = useStyles(props);
  const headerEl = useRef(null);

  useEffect(() => {
    dispatch(getEvents());
  }, []);

  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;

    dispatch(
      openNewEventDialog({
        start,
        end,
      })
    );
  };

  const handleEventClick = (clickInfo) => {
    const { id, title, allDay, start, end, extendedProps } = clickInfo.event;
    dispatch(
      openEditEventDialog({
        id,
        title,
        allDay,
        start,
        end,
        extendedProps,
      })
    );
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto relative')}>
      <AgendaHeader calendarRef={calendarRef} currentDate={currentDate} />

      <div className="flex flex-1 p-24 container">
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends
            datesSet={handleDates}
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            initialDate={new Date()}
            ref={calendarRef}
          />
        </motion.div>
        <EventDialog />
      </div>
    </div>
  );
};
export default withReducer('Agenda', reducer)(AgendaPage);
