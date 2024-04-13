import { Box, Typography, useTheme } from '@mui/material';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setRecommendedFriends } from 'state';


const serverURL = process.env.REACT_APP_SERVER_URL;

const RecommendedFriendsList = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);


    const getFriends = async () => {
        const response = await fetch(`${serverURL}/user/${userId}/friends`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const recommendedFriends = useSelector((state) => state.recommendedFriends);
     //Display recommended friends
    const getRecommendedFriends = async () => {
        //Loop through friends array
        //Display friends of friends
        /*
        let tempRecommendedFriends = [];
        for (let i = 0; i < friends.length; i++) {
            let friendId = friends[i]._id;
            const response = await fetch(`${serverURL}/user/${friendId}/friends`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            for (let j = 0; j < data.length; j++) {
                if (data[j]._id !== userId && !friends.includes(data[j]) && !tempRecommendedFriends.includes(data[j])) {
                    tempRecommendedFriends.push(data[j]);
                }
            }
        }

        //console.log("Temp Recommended Friends: ", tempRecommendedFriends);

        let counter = 0;
        let randomizedRecommendedFriends = [];
        for (let i = 0; i < tempRecommendedFriends.length; i++) {
            if (counter === 5) {
                break;
            }
            else {
                let recommendedFriend = tempRecommendedFriends[i];
                randomizedRecommendedFriends.push(recommendedFriend);
                counter++;
            }
        }

        // console.log("Recommended Friends: ", recommendedFriends);
        dispatch(setRecommendedFriends({ recommendedFriends: randomizedRecommendedFriends }));
        */
    };

    
    return (
        getRecommendedFriends(),
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Recommended Friends
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {recommendedFriends.map((friend) => (
                    <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        // subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default RecommendedFriendsList;