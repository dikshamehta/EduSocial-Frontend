//Handles a SINGLE post

import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import UserImage from "components/UserImage";
// import FacebookIcon from '@mui/icons-material/Facebook';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { TwitterShareButton, XIcon } from 'react-share';
//import XIcon from '@mui/icons-material/X';
import PollWidget from "./PollWidget";

const serverURL = process.env.REACT_APP_SERVER_URL;

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    picturePath,
    videoPath,
    pollData,
    userPicturePath,
    likes,
    comments,
    updatePost = setPost,
    width = "650px",
    m = "2rem 0"
}) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const loggedInUserUsername = useSelector((state) => state.user.username);
    const loggedInUserPicturePath = useSelector((state) => state.user.picturePath);

    let isLiked = false;
    if (loggedInUserId in likes) {
        isLiked = true;
    }
    else {
        isLiked = false;

    }
    // const isLiked = Boolean(likes[loggedInUserId]); //Checks if the user has liked the post
    // const isLiked = likes.includes(loggedInUserId); //Checks if the user has liked the post
    // const isLiked = likes.some((like) => like.userId === loggedInUserId); //Checks if the user has liked the post
    
    //Check if user has liked the post, handling defined and undefined



    const likeCount = Object.keys(likes).length; //Counts the number of likes
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
        const response = await fetch(`${serverURL}/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: loggedInUserId }), //Keeps track of whether user has liked the post
        });
        const updatedPost = await response.json();
        dispatch(updatePost({ post: updatedPost }));
    };

    const handleComment = async () => {
        let comment = document.getElementById("commentToAdd").value;
        const response = await fetch(`${serverURL}/posts/${postId}/comment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: loggedInUserId, userUsername: loggedInUserUsername,userPicturePath: loggedInUserPicturePath, comment: comment}),
        });
        const updatedPost = await response.json();
        dispatch(updatePost({ post: updatedPost }));
    };
    
    const types = ["Cash", "Credit Card", "Bitcoin"];
  
    return (
      <WidgetWrapper m="2rem 0" width="650px">
        <Friend
          friendId={postUserId}
          name={name}
          //subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`${serverURL}/assets/${picturePath}`}
          />
        )}
        {videoPath && (
          <video
            width="100%"
            height="auto"
            controls
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          >
            <source src={`${serverURL}/assets/${videoPath}`} />
          </video>
        )}
        {pollData && <PollWidget thisPollData={pollData} parentId={postId} />}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {" "}
                {/* Determines whether one has liked or not */}
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              {" "}
              {/* Comments */}
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <FlexBetween gap="0.25rem">
            <FacebookShareButton url={"https://developers.facebook.com/"}>
              <FacebookIcon size={25} round />
            </FacebookShareButton>
            <TwitterShareButton url={"https://developers.facebook.com/"}>
              <XIcon size={25} round />
            </TwitterShareButton>
          </FlexBetween>
        </FlexBetween>
        {isComments && ( //If comments are present, display them
          <Box mt="0.5rem">
            <InputBase
              placeholder="Add a comment"
              // onChange={(e) => setPost(e.target.value)}
              // value={post}
              id="commentToAdd"
              sx={{
                width: "93%",

                // m : "0",
                // width: "100px",
                // resize: "none",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
            />
            <IconButton onClick={handleComment}>
              <SendIcon />
            </IconButton>

            {/*Display the comments */}
            <Box display="flex" flexDirection="column" gap="0.5rem">
              {comments.map((comment, index) => (
                <FlexBetween gap="0.5rem">
                  <Box key={index} mt="0.5rem">
                    <UserImage image={comment.userPicturePath} size="55px" />
                  </Box>
                  <Box key={index} mt="0.5rem">
                    <Typography
                      color={main}
                      sx={{ mt: "0.25rem", mr: "29rem" }}
                      fontWeight="500"
                      variant="h5"
                    >
                      {comment.userUsername}
                    </Typography>
                    <Typography color={main} sx={{ mt: "0.25rem" }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                </FlexBetween>
              ))}
            </Box>

            {/* <Divider padding="0.5rem 0.5rem" /> */}
          </Box>
        )}
      </WidgetWrapper>
    );
};
  
export default PostWidget; 