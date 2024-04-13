import { Box, Typography, useTheme } from '@mui/material';
// import Friend from 'components/Friend';
import FriendRequest from 'components/FriendRequest';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriendRequests } from 'state';

const serverURL = process.env.REACT_APP_SERVER_URL;

const FriendRequestListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friendRequests = useSelector((state) => state.user.friendRequests);

    const getFriendRequests = async () => {
        const response = await fetch(`${serverURL}/user/${userId}/friendRequests`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFriendRequests({ friendRequests: data }));
    };

    useEffect(() => {
        getFriendRequests();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend Requests
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friendRequests.map((friendRequest) => (
                    <FriendRequest
                        key={friendRequest._id}
                        friendId={friendRequest._id}
                        name={`${friendRequest.firstName} ${friendRequest.lastName}`}
                        subtitle={friendRequest.occupation}
                        userPicturePath={friendRequest.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );

};

export default FriendRequestListWidget;