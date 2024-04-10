import React, { useEffect } from 'react';
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
import {setPost, setSearchPost, setSearchResults} from "state";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { useNavigate } from "react-router-dom";
import PostWidget from "../scenes/widgets/PostWidget";
import UserWidget from "../scenes/widgets/UserWidget";
import FriendListWidget from "../scenes/widgets/FriendListWidget";
import SortingOptions from "./SortOptions";
import PageExploreWidget from "../scenes/widgets/PageExploreWidget";

const serverPort = process.env.REACT_APP_SERVER_PORT

const SearchResults = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.searchResults);
    const filterResults = useSelector((state)=>state.filterResults);
    const type = filterResults.type;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const authenticatedUser = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const loggedInUserFriends = useSelector((state) => state.user.friends);
    const relevanceComparisonSet = new Set();
    loggedInUserFriends.forEach(friend => relevanceComparisonSet.add(friend._id));
    // including the logged in user itself in the relevance comparison set
    relevanceComparisonSet.add(authenticatedUser._id);

    // loggedInUser contains the full details of authenticatedUser
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Fetching user details (displayTag is required for sorting posts based on relevance)
    useEffect(()=> {
        async function fetchUser() {
            const response = await fetch(`http://localhost:${serverPort}/user/${authenticatedUser._id}`, { //API call
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setLoggedInUser(data);
        }
        fetchUser();
    }, [authenticatedUser]);

    const peopleSortOptions = ["Name Ascending", "Name Descending", "Relevance"];
    const postSortOptions = ["Latest", "Oldest", "Relevance"];
    const [peopleSortValue, setPeopleSortValue] = useState(peopleSortOptions[2]);
    const [postSortValue, setPostSortValue] = useState(postSortOptions[0]);
    // TODO: the default peopleSortValue must match the actual order in the people list when no sort option 
    // is selected by user.

    function countRelevance(friendIds){
        let relevance = 0;
        friendIds.forEach((friendId) => {
            if(relevanceComparisonSet.has(friendId)){
                relevance++;
            }
        });
        return relevance;
    }
    const handlePeopleSortChange = (event) => {
        setPeopleSortValue(event.target.value);
        console.log(event.target.value);
        let updatedSearchResults = structuredClone(searchResults);
        if(event.target.value == peopleSortOptions[0]) {
            updatedSearchResults.people.sort(
                (a, b) => a.firstName.localeCompare(b.firstName)
            );
        } else if (event.target.value == peopleSortOptions[1]) {
            updatedSearchResults.people.sort(
                (a, b) => b.firstName.localeCompare(a.firstName)
            );
        } else {
            updatedSearchResults.people.sort(
                (a, b) => countRelevance(b.friends) - countRelevance(a.friends)
            );
        }
        dispatch(setSearchResults(updatedSearchResults));
    };

    const handlePostSortChange = (event) => {
        setPostSortValue(event.target.value);
        console.log(event.target.value);
        let updatedSearchResults = structuredClone(searchResults);
        if(event.target.value == postSortOptions[0]) {
            updatedSearchResults.posts.sort(
                (a, b) => a.createdAt < b.createdAt ? -1:1
            )
        } else if (event.target.value == postSortOptions[1]) {
            updatedSearchResults.posts.sort(
                (a, b) => b.createdAt < a.createdAt ? -1:1
            )
        } else {
            let relevantPosts = []
            let remainingPosts = []
            updatedSearchResults.posts.forEach((post) => {
                if(post.displayTag == loggedInUser.displayTag) {
                    relevantPosts.push(post);
                } else {
                    remainingPosts.push(post);
                }
            });
            updatedSearchResults.posts = relevantPosts.concat(remainingPosts);
        }
        dispatch(setSearchResults(updatedSearchResults));
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

    let pages_mapping = page => (
        <PageExploreWidget page={page}/>
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
            <SortingOptions 
                sortValue = {peopleSortValue} 
                sortOptions={peopleSortOptions} 
                onSortChange={handlePeopleSortChange}/>
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
            <SortingOptions 
                sortValue = {postSortValue} 
                sortOptions={postSortOptions} 
                onSortChange={handlePostSortChange}/>
        </WidgetWrapper>
        <Divider/>
        {searchResults.posts.map(posts_mapping)}
    </Box>

    let pages_results = <Box>
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
                Pages
            </Typography>
        </WidgetWrapper>
        <Divider/>
        {searchResults.pages.map(pages_mapping)}
    </Box>



    if(type === "Posts"){
        return posts_results
    }
    else if(type === "People"){
        return people_results
    }
    else if(type === "Pages"){
        return pages_results
    }
    else{
        return (
            <Box>
                {people_results}
                {posts_results}
                {pages_results}
            </Box>
        );
    }

};

export default SearchResults;
