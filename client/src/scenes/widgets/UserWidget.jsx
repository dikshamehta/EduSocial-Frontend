import {
    ManageAccountsOutlined,
    // EditOutlined,
    // LocationOnOutlined,
    // WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//This is the left hand side of the home page that displays the user's information

const serverPort = process.env.REACT_APP_SERVER_PORT;

const UserWidget = ({ userId, picturePath }) => {
    const [ user, setUser ] = useState(null); //Grabs user from the backend
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    //We want to grab user information, so we call API
    const getUser = async () => {
        const response = await fetch(`http://localhost:${serverPort}/user/${userId}`, { //API call
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => { //When you enter this page, because we have empty array, getUser will be called and component gets rendered when you first get to pag 
        getUser();
    }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null; //If user is not found, return null

    const { //Destructuring user object
        username,
        firstName,
        lastName,
        friends,
        emailPrivacy,
        email
    } = user;

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${userId}`)} 
            >
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{ 
                                "&:hover": { 
                                    color: main, 
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {firstName} {lastName}
                        </Typography>
                        <Typography color={medium}>{username}</Typography>
                        {emailPrivacy === true ? null : <Typography color={medium}>{email}</Typography>}
                        <Typography color={medium}>{friends.length} friends</Typography>
                    </Box>
                </FlexBetween>
                {/* <ManageAccountsOutlined /> */}

                
            </FlexBetween>
            <Divider/>
        </WidgetWrapper>
    )
};

export default UserWidget;