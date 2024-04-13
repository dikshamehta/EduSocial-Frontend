import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "./UserImage";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { setBlockedUsers } from "state";

const serverURL = process.env.REACT_APP_SERVER_URL;

const BlockedUser = ({ friendId, name, /*subtitle,*/ userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    let blockedUsers = useSelector((state) => state.user.blockedUsers);

    const { palette } = useTheme();
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;

    const unblockUser = async () => {
        const response = await fetch(
            `${serverURL}/user/${_id}/${friendId}/unblock`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
        );
        const data = await response.json();
        console.log("Blocked User Data: ", data)
    
        dispatch(setBlockedUsers({ blockedUsers: data }));
    }

    return (
        <FlexBetween>
            <FlexBetween 
                padding="rem 0rem"
                gap="1rem"
            >
                <UserImage 
                    image={userPicturePath} 
                    size="55px" 
                />
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
            <div
                
            >
                <IconButton
                    onClick={() => unblockUser()}
                    sx={{ backgroundColor: "#B9F0B8", p: "0.6rem", opacity: "0.8", ml:"3rem"}}
                    

                >
                    <CancelOutlinedIcon sx={{ color: "#FF4954" }} />
                </IconButton>
            </div>

        </FlexBetween>
    );


};

export default BlockedUser;