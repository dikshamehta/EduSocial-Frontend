import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import PagePostWidget from "./PagePostWidget";
import { useState } from "react";

const serverPort = process.env.REACT_APP_SERVER_PORT;
const PagePostContainerWidget = ({ pageId }) => {
    const [posts, setPosts] = useState([]);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();

    const getPosts = async () => {
        try {
            const response = await fetch(`http://localhost:${serverPort}/pagePost/${pageId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setPosts(data.reverse());
        } catch (error) {
            console.error("Error fetching page posts:", error);
        }
    };

    useEffect(() => {
        getPosts();
    }, [pageId, token, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <Box sx={{ maxHeight: "70vh", overflowY: "auto", mt: "1rem" }}>
        {posts.length === 0 ? (
          <Typography variant="h4" align="center">
            No posts yet
          </Typography>
        ) : (
          posts.map(
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
            }) => (
              <PagePostWidget
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
          )
        )}
      </Box>
    );
};

export default PagePostContainerWidget;