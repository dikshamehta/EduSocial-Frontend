import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setFriendRequests } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, /*subtitle,*/ userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends); //User has friends array

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    //Check if the user is a friend (different icons for adding/removing friend)
    let isFriend = false;
    for (let i = 0; i < friends.length; i++) {
        if (friends[i]._id === friendId) {
            isFriend = true;
            break;
        }
        else {
            isFriend = false;
        }
    }

    const patchFriend = async () => { //API call for adding/removing friend
        const response = await fetch(
            `http://localhost:5000/user/${_id}/${friendId}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          //Data contains the updated friends array and friendRequests array
          const friends = data.friends;
          const friendRequests = data.friendRequests;

          console.log(data);
          console.log(friends);
          console.log(friendRequests);

          dispatch(setFriends({ friends: friends }));
          dispatch(setFriendRequests({ friendRequests: friendRequests }));   

    };

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
            {_id !== friendId && ( //User cannot add/remove themselves as a friend
                <IconButton
                    onClick={() => patchFriend()}
                    sx={{ backgroundColor: "#B9F0B8", p: "0.6rem", opacity: "0.8" }}
                >
                    {isFriend ? ( //If the user is a friend, show remove friend icon, else show add friend icon
                        <PersonRemoveOutlined sx={{ color: primaryDark }} />
                    ) : (
                        <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                </IconButton>
            )}
            {/* <IconButton
                onClick={() => patchFriend()}
                sx={{ backgroundColor: "#B9F0B8", p: "0.6rem", opacity: "0.8" }}
            >
                {isFriend ? ( //If the user is a friend, show remove friend icon, else show add friend icon
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                )}
            </IconButton> */}
        </FlexBetween>
    );
};

export default Friend;