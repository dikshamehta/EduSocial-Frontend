import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NavBar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import UserWidget from 'scenes/widgets/UserWidget';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';

const serverURL = process.env.REACT_APP_SERVER_URL;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  
    const getUser = async () => {
        const response = await fetch(`${serverURL}/user/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };
  
    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    if (!user) return null;

    let profilePrivacy = user.profilePrivacy;
    // let friendIds = user.friends.map(friend => friend._id);
    let friends = user.friends;
    let picturePath = user.picturePath;
    let firstName = user.firstName;
    let lastName = user.lastName;

    return (
        <Box>
            <NavBar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            > 
                {profilePrivacy === true && !friends.includes(loggedInUserId) && userId !== loggedInUserId 
                 ? 
                    <>
                        <WidgetWrapper>
                            <Box flexBasis={isNonMobileScreens ? "26%" : undefined} width="400px" flexDiretion="column" gap="1.5rem" mt="1rem">
                                {/* <UserWidget userId={userId} picturePath={user.picturePath} /> */}
                                <Friend
                                    key={userId}
                                    friendId={userId}
                                    name={`${firstName} ${lastName}`}
                                    // subtitle={friend.occupation}
                                    userPicturePath={picturePath}
                                />
                                <Box m="2rem 0" />
                            </Box>
                        </WidgetWrapper>
                        <Typography
                            variant="h5"
                            fontWeight="500"
                            fontSize="1.5rem"
                            textAlign="center"
                            mt="15rem"
                            position="absolute"
                            width={isNonMobileScreens ? "42%" : undefined}
                        >
                            This user is private. Send him a friend request to view his profile!
                        </Typography>
                    </>
                : 
                    <>
                        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                            <UserWidget userId={userId} picturePath={user.picturePath} />
                            <Box m="2rem 0" />
                            <FriendListWidget userId={userId} />
                        </Box>

                        {userId !== loggedInUserId
                        ?
                            <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? "-2rem" : "2rem"}>
                                <PostsWidget userId={userId} isProfile />
                            </Box>
                        :
                            <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                                <MyPostWidget picturePath={user.picturePath} />
                                <Box m="2rem 0" />
                                <PostsWidget userId={userId} isProfile />
                            </Box>
                        }

                        {/* <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                            <MyPostWidget picturePath={user.picturePath} />
                            <Box m="2rem 0" />
                            <PostsWidget userId={userId} isProfile />
                        </Box> */}
                    </>

                    // <>
                    //     <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                    //         <MyPostWidget picturePath={user.picturePath} />
                    //         <Box m="2rem 0" />
                    //         <PostsWidget userId={userId} isProfile />
                    //     </Box>
                    // </>
                    
                }
            </Box>
        </Box>
    );
};

export default ProfilePage;