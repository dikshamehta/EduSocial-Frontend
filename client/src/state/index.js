import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light',
    user: null,
    token: null,
    posts: [],
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

    },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setFriendRequests } = authSlice.actions;
export default authSlice.reducer;