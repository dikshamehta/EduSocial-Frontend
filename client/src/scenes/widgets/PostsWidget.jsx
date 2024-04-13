//Handles the LIST of posts

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const serverURL = process.env.REACT_APP_SERVER_URL;

const PostsWidget = ({ userId, isProfile = false }) => {
    const dispatch = useDispatch(); //So we can use Redux
    let posts = useSelector((state) => state.posts); //Grabs posts
    posts = Array.from(posts); //Converts posts to an array
    const token = useSelector((state) => state.token); //Grabs token to authorize user
    const [ user, setUser ] = useState({}); //Grabs user

    // let user = useSelector((state) => state.user); //Grabs user
    // let {
    //     displayTag,
    //     recentPostOrder,
    // } = user; //Destructures user


    //2 API calls
    //1. Grabs all the posts - getFeedPosts
    const getPosts = async () => {
        const response = await fetch(`${serverURL}/posts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data })); 
        //Update user
    };

    //2. Grabs all the posts from a specific user - getUserPosts
    const getUserPosts = async () => {
        const response = await fetch(`${serverURL}/posts/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data })); 
    };

    const getUser = async () => {
        const response = await fetch(`${serverURL}/user/${userId}`, { //API call
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
            getUser();
        } 
        else {
            getPosts();
            getUser();
            //Reload user
        
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    //Update state of user with function to be called in sortPosts




    //function to sort posts by algorithm
    const sortPosts = () => {



        //Grabs new state of user
        let {
            displayTag,
            recentPostOrder,
        } = user; //Destructures user
        console.log("I am here before")
        console.log(recentPostOrder)
        
        if (recentPostOrder === true && displayTag !== "") { //Sort by algorithm
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].displayTag === displayTag) {
                    posts.unshift(posts.splice(i, 1)[0]);
                }
            }
        }
        else if (recentPostOrder === false) { //Sorts posts by most recent  =- use createdAt
            console.log("I am here")
            posts.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            
        }
    };

    return ( //Creates component for each post
        //Sort posts by algorithm
        // if (recentPostOrder === true && displayTag !== "") {
        //     for (let i = 0; i < posts.length; i++) {
        //         if (posts[i].displayTag === displayTag) {
        //             posts.unshift(posts.splice(i, 1)[0]);
        //         }
        //     }
        // }

        //Call sortPosts function
        sortPosts(),

        
        <>
            {posts.map( //Destructures posts
                ({
                    _id,
                    userId,
                    firstName,
                    lastName,
                    description,
                    picturePath,
                    videoPath,
                    pollData,
                    userPicturePath,
                    likes,
                    comments,
                }) =>
                 (
                    
                    <PostWidget //Creates a post widget for each post
                        key={_id}
                        postId={_id}
                        postUserId={userId}
                        name={`${firstName} ${lastName}`}
                        description={description}
                        picturePath={picturePath}
                        videoPath={videoPath}
                        pollData={pollData}
                        userPicturePath={userPicturePath}
                        likes={likes}
                        comments={comments}
                    />
                )
            )}
        </>
    );
};

export default PostsWidget;