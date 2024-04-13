import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { TwitterShareButton, XIcon } from 'react-share';
import PollWidget from "./PollWidget";
import { useEffect } from "react";

const serverURL = process.env.REACT_APP_SERVER_URL;

const PagePostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  videoPath,
  pollData,
  likes,
  comments,
}) => {
  const token = useSelector((state) => state.token);
  const [isComments, setIsComments] = useState(false);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserUsername = useSelector((state) => state.user.username);
  const loggedInUserPicturePath = useSelector((state) => state.user.picturePath);

  const [userPagePostState, setUserPagePostState] = useState({
    isLiked: false,
    likeCount: Object.keys(likes).length,
    isComments: false,
    commentCount: comments.length,
  });

  const { palette } = useTheme();
  const main = palette.neutral.main;

  useEffect(() => {
    const checkIfLiked = () => {
      setUserPagePostState(prevState => ({
        ...prevState,
        isLiked: loggedInUserId in likes,
      }));
    };

    checkIfLiked();
  }, [likes, loggedInUserId]);

  const patchLike = async () => {
    await fetch(`${serverURL}/pagePost/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    setUserPagePostState(prevState => ({
      ...prevState,
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked ? prevState.likeCount - 1 : prevState.likeCount + 1,
    }));
  };

  const handleComment = async () => {
    let comment = document.getElementById("commentToAdd").value;
    await fetch(`${serverURL}/pagePost/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        userUsername: loggedInUserUsername,
        userPicturePath: loggedInUserPicturePath,
        comment: comment,
      }),
    });
    setUserPagePostState(prevState => ({
      ...prevState,
      commentCount: prevState.commentCount + 1,
    }));
  };

  return (
    <WidgetWrapper mb="1rem">
      <Friend
        friendId={postUserId}
        name={name}
        userPicturePath={userPicturePath}
      />
      <Typography>{description}</Typography>
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
      {pollData && <PollWidget parentId={postId} />}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {userPagePostState.isLiked ? (
                <FavoriteOutlined />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{userPagePostState.likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{userPagePostState.commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <IconButton></IconButton>
          <FacebookShareButton url={"https://developers.facebook.com/"}>
            <FacebookIcon size={25} round />
          </FacebookShareButton>
          <IconButton></IconButton>
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

export default PagePostWidget;