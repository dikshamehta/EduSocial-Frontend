import React from 'react';
import {Paper, List, ListItem, ListItemText, Avatar, CssBaseline, ThemeProvider} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
    ManageAccountsOutlined,
    // EditOutlined,
    // LocationOnOutlined,
    // WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

import Friend from "components/Friend";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setPost, setSearchPost} from "state";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { useNavigate } from "react-router-dom";
import PostWidget from "../scenes/widgets/PostWidget";



const serverPort = process.env.REACT_APP_SERVER_PORT


const UserCard = ({ user }) => {
    const theme = createTheme();
    const navigate = useNavigate();
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const { userId, firstName, lastName, username, picturePath, friends } = user;

    return (
        <WidgetWrapper key={userId}>
            {/* User info */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${userId}`)} // Replace `navigate` with your navigation function
            >
                {/* User image and basic info */}
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
                        <Typography color={medium}>{friends.length} friends</Typography>
                    </Box>
                </FlexBetween>
                {/* Manage accounts icon */}
                <ManageAccountsOutlined />
            </FlexBetween>
            <Divider/>
        </WidgetWrapper>
    );
};

const SearchResults = () => {
    const filterResults = useSelector((state)=>state.filterResults);
    const type = filterResults.type;
    const searchResults = useSelector((state) => state.searchResults);

    let posts_mapping = ({
                         _id,
                         userId,
                         firstName,
                         lastName,
                         description,
                         picturePath,
                         userPicturePath,
                         likes,
                         comments
                     }) => (
        <PostWidget //Creates a post widget for each post
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            updatePost={setSearchPost}
        />
    )

    let people_mapping = user => (
        <UserCard user={user} />
    )

    if(type === "Posts"){
        return (
            <Box>
                {searchResults.posts.map(posts_mapping)}
            </Box>
        )
    }
    else if(type === "People"){
        return (
            <Box>
                {searchResults.people.map(people_mapping)}
            </Box>
        )
    }
    else{
        return (
            <Box>
                {/* Render posts */}

                {searchResults.posts.map(posts_mapping)}

                {/* Render users */}
                {searchResults.people.map(people_mapping)}
            </Box>
        );
    }

};

export default SearchResults;
