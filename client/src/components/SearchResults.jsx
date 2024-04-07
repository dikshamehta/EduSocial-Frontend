import React from 'react';
import {Paper, List, ListItem, ListItemText, Avatar, CssBaseline, ThemeProvider, useMediaQuery} from '@mui/material';
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
import UserWidget from "../scenes/widgets/UserWidget";
import FriendListWidget from "../scenes/widgets/FriendListWidget";
import SortingOptions from "./SortOptions";

const serverPort = process.env.REACT_APP_SERVER_PORT

const SearchResults = () => {
    const filterResults = useSelector((state)=>state.filterResults);
    const type = filterResults.type;
    const searchResults = useSelector((state) => state.searchResults);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const [sortValue, setSortValue] = useState('ascending');

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
        // Perform sorting logic based on the selected value
    };

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
        <UserWidget userId={user._id} picturePath={user.picturePath} />
    )

    let people_results = <Box>
        <WidgetWrapper  display={"flex"} flexDirection={"row"}
        >
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
                People
            </Typography>
            <SortingOptions sortValue = {"ascending"} onSortChange={handleSortChange}/>
        </WidgetWrapper>
        <Divider/>

        {searchResults.people.map(people_mapping)};
    </Box>

    let posts_results = <Box>
        <WidgetWrapper>
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
                Posts
            </Typography>
        </WidgetWrapper>
        <Divider/>
        {searchResults.posts.map(posts_mapping)}
    </Box>



    if(type === "Posts"){
        return posts_results
    }
    else if(type === "People"){
        return people_results
    }
    else{
        return (
            <Box>
                {people_results}
                {posts_results}
            </Box>
        );
    }

};

export default SearchResults;
