import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const serverURL = process.env.REACT_APP_SERVER_URL;
const NotificationWindowWidget = ({ onClose, anchorEl }) => {
    const _id = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    const getNotifications = async () => {
        let data;
        try {
          const response = await fetch(`${serverURL}/user/${_id}/notifications`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json());
          data = response;
        } catch (error) {
          data = [];
        }
        
        setNotifications(data);
    };

    useEffect(() => {
        getNotifications();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={onClose}
      >
        <WidgetWrapper width="30vw" height="25vh">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" mb="10px">
              Notifications
            </Typography>
            <Box maxHeight="calc(25vh - 100px)" overflow="auto" width="100%">
              {notifications.length !== 0 ? (
                <List>
                  {notifications.map((notification, index) => (
                    <ListItem
                      key={index}
                      onClick={() => navigate(notification.link)}
                    >
                      <ListItemText primary={notification.message} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="h6">No notifications</Typography>
              )}
            </Box>
            <Button onClick={onClose}>Close</Button>
          </Box>
        </WidgetWrapper>
      </Popover>
    );
};

export default NotificationWindowWidget;
