import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light',
    user: null,
    token: null,
    posts: [],
    searchResults: {
        posts: [],
        people: [],
        pages: []
    },
    filterResults: {
        results: {
            posts: [],
            people: [],
            pages: []
        },
        type: "All"
    },
    recommendedFriends: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { //Functions that involve modifying the global state
        setMode: (state) => { //For light and dark mode
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            }
            else {
                console.log("User friends not found");
            }
        },
        setBlockedUsers: (state, action) => {
            if (state.user) {
                state.user.blockedUsers = action.payload.blockedUsers;
            }
            else {
                console.log("User blocked users not found");
            }
        },
        setFriendRequests: (state, action) => {
            if (state.user) {
                state.user.friendRequests = action.payload.friendRequests;
            }
            else {
                console.log("User friend requests not found");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                }
                return post;
            });
            state.posts = updatedPosts;
        },
        setSearchPost: (state, action) => {
            console.log('search post update');
            const updatedPosts = state.searchResults.posts.map((post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                }
                return post;
            });
            state.searchResults.posts = updatedPosts;
        },
        setSearchResults: (state, action) => {
            state.searchResults = structuredClone(action.payload);
        },
        setFilterResults: (state, action) => {
            state.filterResults = action.payload;
        },
        setRecommendedFriends: (state, action) => {
            state.recommendedFriends = action.payload.recommendedFriends;
        }
    },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setFriendRequests, setSearchPost, setSearchResults, setFilterResults, setBlockedUsers, setRecommendedFriends } = authSlice.actions;
export default authSlice.reducer;