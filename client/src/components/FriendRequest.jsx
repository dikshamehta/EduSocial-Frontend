import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "./UserImage";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { setFriendRequests } from "state";

const serverURL = process.env.REACT_APP_SERVER_URL;

const FriendRequest = ({ friendId, name, /*subtitle,*/ userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    // const friends = useSelector((state) => state.user.friends); //User has friends array
    const friendRequests = useSelector((state) => state.user.friendRequests);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    //Check if the user is a friend (different icons for adding/removing friend)
    // let isFriend = false;
    // for (let i = 0; i < friends.length; i++) {
    //     if (friends[i]._id === friendId) {
    //         isFriend = true;
    //         break;
    //     }
    //     else {
    //         isFriend = false;
    //     }
    // }

    //Check if the user has a friend request
    let hasFriendRequest = false;
    for (let i = 0; i < friendRequests.length; i++) {
        if (friendRequests[i]._id === friendId) {
            hasFriendRequest = true;
            break;
        }
        else {
            hasFriendRequest = false;
        }
    }


    // const patchFriend = async () => { //API call for adding/removing friend
    //     const response = await fetch(
    //         `${serverURL}/user/${_id}/${friendId}`,
    //         {
    //           method: "PATCH",
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );
    //       const data = await response.json();
    //       dispatch(setFriends({ friends: data }));
    // };

    const acceptRequest = async () => {
        const response = await fetch(
            `${serverURL}/user/${_id}/${friendId}/accept`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        const data = await response.json();
        // console.log(data);
        //   dispatch(setFriends({ friends: data }));
        //   dispatch(setFriendRequests({ friendRequests: data }));
        const friends = data.friends;
        const friendRequests = data.friendRequests;
        // const friends = data[0];
        // const friendRequests = data[1];
        dispatch(setFriends({ friends: friends })); //friends is first element in data
        dispatch(setFriendRequests({ friendRequests: friendRequests }));
    }

    const declineRequest = async () => {
        const response = await fetch(
            `${serverURL}/user/${_id}/${friendId}/decline`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        const data = await response.json();
        //   dispatch(setFriends({ friends: data }));
        //   dispatch(setFriendRequests({ friendRequests: data }));
        // const friends = data[0];
        // const friendRequests = data[1];
        const friends = data.friends;
        const friendRequests = data.friendRequests;
        dispatch(setFriends({ friends: friends })); //friends is first element in data
        dispatch(setFriendRequests({ friendRequests: friendRequests }));
    }





    

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${friendId}`);
                        navigate(0); //Work around to get components to re-render (Bug = when you go to the user, go to a certain person's profile page, then try to click on someone else's profile page and try to go to that page, the components do not re-render)
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    {/* <Typography color={medium} fontSize="0.75rem"> */}
                        {/* {subtitle} */}
                    {/* </Typography> */}
                </Box>
            </FlexBetween>
            <IconButton
                onClick={() => declineRequest()}
                sx={{ backgroundColor: "#B9F0B8", p: "0.6rem", opacity: "0.8", ml: "5rem" }}
            >
                <CancelOutlinedIcon sx={{ color: "#FF4954" }} />
            </IconButton>

            <IconButton
                onClick={() => acceptRequest()}
                sx={{ backgroundColor: "#B9F0B8", p: "0.6rem", opacity: "0.8" }}
            >
                <CheckCircleOutlineIcon sx={{ color: primaryDark }} />
                {/* {isFriend ? ( //If the user is a friend, show remove friend icon, else show add friend icon
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                )} */}
            </IconButton>
        </FlexBetween>
    );
};

export default FriendRequest;