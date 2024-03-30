import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "../widgets/PostWidget";
import { useParams } from "react-router-dom";

const SinglePostPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const main = theme.palette.neutral.main;
    const dispatch = useDispatch(); //So we can use Redux

    //Grab the postid from the URL
    const { userId, postId } = useParams(); //Grabs postId from URL
    

    //use postId to get the post
    // const [ post, setPosts ] = useState(""); //Grabs posts
    let posts = useSelector((state) => state.posts); //Grabs posts
    console.log("posts", posts);


    //Iterate through posts and find the post matching the userId and postId
    let post = posts.filter((post) => post.userId === userId && post._id === postId);
    console.log("post", post);

    let firstName = post[0].firstName;

    //Get the likes that is a map
    let likes = post[0].likes;

    //Get the comments
    let comments = post[0].comments;

    

    // posts = Array.from(posts); //Converts posts to an array
    const token = useSelector((state) => state.token); //Grabs token to authorize user
    const [ user, setUser ] = useState({}); //Grabs user


    return (
        <>
            <Box>
                <Box
                    width="100%"
                    backgroundColor={theme.palette.background.alt}
                    p="1rem 6%"
                    textAlign="center"
                >
                    <Typography 
                        fontWeight="bold"
                        fontSize="32px"
                        color="primary"
                        onClick={() => navigate("/home")} //Navigate to home page
                        sx={{
                            "&:hover": {
                            color: main,
                            cursor: "pointer",
                            },
                        }}
                    >
                        EduSocial
                    </Typography>
                </Box>

                {/* <Box
                    width={isNonMobileScreens ? "50%" : "93%"}
                    p="2rem"
                    m="2rem auto"
                    borderRadius="1.5rem"
                    backgroundColor={theme.palette.background.alt}
                >
                    <Typography fontWeight="700" variant="h4" sx={{ mb: "1.5rem"}}>
                        Single Post
                    </Typography>
                </Box> */}
            </Box>
            
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2rem",
                }}
            >
                <PostWidget  //Creates a post widget for each post
                    key={post[0]._id}
                    postId={post[0]._id}
                    postUserId={post[0].userId}
                    name={`${post[0].firstName} ${post[0].lastName}`}
                    description={post[0].description}
                    picturePath={post[0].picturePath}
                    videoPath={post[0].videoPath}
                    pollData={post[0].pollData}
                    userPicturePath={post[0].userPicturePath}
                    likes={likes}
                    comments={comments}
                />
            </div>
                
        </>
    );
};

export default SinglePostPage;