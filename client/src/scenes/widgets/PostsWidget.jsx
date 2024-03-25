//Handles the LIST of posts

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
    const dispatch = useDispatch(); //So we can use Redux
    let posts = useSelector((state) => state.posts); //Grabs posts
    posts = Array.from(posts); //Converts posts to an array
    const token = useSelector((state) => state.token); //Grabs token to authorize user

    //2 API calls
    //1. Grabs all the posts - getFeedPosts
    const getPosts = async () => {
        const response = await fetch("http://localhost:5000/posts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data })); 
    };

    //2. Grabs all the posts from a specific user - getUserPosts
    const getUserPosts = async () => {
        const response = await fetch(`http://localhost:5000/posts/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data })); 
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } 
        else {
            getPosts();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return ( //Creates component for each post
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