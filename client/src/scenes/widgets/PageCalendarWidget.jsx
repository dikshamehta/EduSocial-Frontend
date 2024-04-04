import React, { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, Typography, TextField, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from "react-redux";
const serverPort = process.env.REACT_APP_SERVER_PORT;
const PageCalendarWidget = ({ pageId }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [events, setEvents] = useState([]);
    
    const token = useSelector((state) => state.token);

    useEffect(() => {
        fetchEvents();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:${serverPort}/page/${pageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                const formattedEvents = data.events.map(event => ({
                    ...event,
                    date: new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })
                }));
                const sortedEvents = formattedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(sortedEvents); // Set events received from the backend to state
            } else {
                console.error('Failed to fetch events:', data.message);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleEventNameChange = (event) => {
        setEventName(event.target.value);
    };

    const handleEventDescriptionChange = (event) => {
        setEventDescription(event.target.value);
    };

    const handleAddEvent = async () => {
        if (selectedDate && eventName && eventDescription) {
            const newEvent = {
              date: selectedDate,
              name: eventName,
              description: eventDescription,
            };
            try {
                const response = await fetch(`http://localhost:${serverPort}/page/${pageId}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ events: [...events, newEvent] }),
                });
                if (response.ok) {
                    setEvents([...events, newEvent]);
                    setSelectedDate('');
                    setEventName('');
                    setEventDescription('');
                } else {
                    console.error('Failed to add event:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding event:', error);
            }
        } else {
            alert('Please select a date, enter an event name, and provide a description.');
        }
    };

    return (
      <WidgetWrapper mt="0.5rem" width="50vh" height="90vh">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" mb="10px" fontWeight="bold">
            Create an Event
          </Typography>
          <TextField
            value={eventName}
            onChange={handleEventNameChange}
            size="small"
            placeholder="Event Name"
            sx={{
              width: "50%",
              height: "100%",
              marginBottom: "10px",
            }}
          />
          <TextField
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            size="small"
            multiline
            maxRows={4}
            placeholder="Event Description"
            sx={{
              width: "50%",
              height: "100%",
              marginBottom: "10px",
            }}
          />
          <Typography variant="h4" sx={{ mb: "5px" }}>Choose Date</Typography>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEvent}
            sx={{ mt: "15px" }}
          >
            Add Event
          </Button>
        </Box>
        <Box mt={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: "10px" }}>Events</Typography>
          <Divider />
          <List>
            {events.map((event, index) => (
              <ListItem key={index}>
                <Typography variant="h5">
                  {`${event.date} - ${event.name}`}
                  <Typography variant="body1">{event.description}</Typography>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        {events.length === 0 && (
          <Typography variant="h5" align="center" mt="1rem">
            No events yet
          </Typography>
        )}
      </WidgetWrapper>
    );
};

export default PageCalendarWidget;