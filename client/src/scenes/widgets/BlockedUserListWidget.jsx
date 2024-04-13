import { Box, Typography, useTheme } from '@mui/material';
// import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';
import BlockedUser from 'components/BlockedUser';
import { setBlockedUsers } from 'state';

const serverURL = process.env.REACT_APP_SERVER_URL;

const BlockedUserListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);

    //Get the blocked users
    let blockedUsers = useSelector((state) => state.user.blockedUsers);
    console.log("Blocked Users: ", blockedUsers)    


    const getBlockedUsers = async () => {
        const response = await fetch(`${serverURL}/user/${userId}/blockedUsers`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Blocked Users Data: ", data)
        dispatch(setBlockedUsers({ blockedUsers: data }));
    };

    useEffect(() => {
        getBlockedUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
            {/* <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Blocked Users
            </Typography> */}
            <Box 
                
                gap="1.5rem"
                // sx={{ gridColumn: "span 4"}}
            >
                {blockedUsers.map((blockedUser) => (
                    <BlockedUser
                        key={blockedUser._id}
                        friendId={blockedUser._id}
                        name={`${blockedUser.firstName} ${blockedUser.lastName}`}
                        // subtitle={blockedUser.occupation}
                        userPicturePath={blockedUser.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default BlockedUserListWidget;