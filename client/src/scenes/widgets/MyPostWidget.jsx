import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import PollIcon from '@mui/icons-material/Poll';
import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import Form from "./PollForm";
import { type } from "@testing-library/user-event/dist/type";

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [ isImage, setIsImage ] = useState(false); //Represent the switch whether someone has clicked image button
    const [ image, setImage ] = useState(null); //Represent the image that is uploaded
    const [ post, setPost ] = useState(""); //Represent the post
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user); //Grabs user id so we know who is posting content
    const token = useSelector((state) => state.token); //Grabs token to authorizer user
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [ isVideo, setIsVideo ] = useState(false); //Represent the switch whether someone has clicked video button
    const [ video, setVideo ] = useState(null); //Represent the video that is uploaded

    const [ isPoll, setIsPoll ] = useState(false); //Represent the switch whether someone has clicked poll button
    const [ poll, setPoll ] = useState(null); //Represent the poll that is uploaded

    //Function that handles the post and makes the API call
    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);
        if (image) {
            formData.append("file", image); //Uploads image if it is given
            formData.append("picturePath", image.name);

            const imageType = image.type;
            console.log(imageType);
            if (imageType !== "image/jpeg" && imageType !== "image/png" && imageType !== "image/jpg") {
                alert("Image must be in .jpeg, .jpg, or .png format");
                return;
            }

            
        }
        if (video) {
            formData.append("file", video); //Uploads video if it is given
            formData.append("videoPath", video.name);

            const videoType = video.type;
            if (videoType !== "video/mov" && videoType !== "video/mp4") {
                alert("Video must be in .mov or .mp4 format");
                return;
            }
        }
        if (isPoll) {
            const pollData = {
                question: poll.question,
                options: poll.options
            }
            formData.append("pollData", JSON.stringify(pollData));
        }

        const response = await fetch("http://localhost:5000/posts", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({posts})); //Keeps list of posts updated
        setImage(null);
        setIsImage(false);
        setVideo(null);
        setIsVideo(false);
        setPoll(null);
        setIsPoll(false);
        setPost("");
    };

    const handleGetPollData = (pollData) => {
        setPoll(pollData);
    };

    return (
        <WidgetWrapper width="650px">
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase 
                    placeholder="How are you feeling?"
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here (.jpg, .jpeg, .png)</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            {isVideo && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".mov,.mp4"
                        multiple={false}
                        onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!video ? (
                                        <p>Add Video Here (.mov, .mp4)</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{video.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {video && (
                                    <IconButton
                                        onClick={() => setVideo(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            {isPoll && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Form getFormData={handleGetPollData} />
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsImage(!isImage);
                    setImage(null);
                    if (isVideo) {
                        setIsVideo(!isVideo);
                        setVideo(null);
                    }
                    if (isPoll) {
                        setIsPoll(!isPoll);
                        setPoll(null);
                    }
                }}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem" onClick={() => {
                            setIsVideo(!isVideo);
                            setVideo(null);
                            if (isImage) {
                                setIsImage(!isImage);
                                setImage(null);
                            }
                            if (isPoll) {
                                setIsPoll(!isPoll);
                                setPoll(null);
                            }
                        }}>
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography 
                                color={mediumMain}
                                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                            >
                                Clip
                            </Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem" onClick={() => {
                            setIsPoll(!isPoll);
                            setPoll(null);
                            if (isImage) {
                                setIsImage(!isImage);
                                setImage(null);
                            }
                            if (isVideo) {
                                setIsVideo(!isVideo);
                                setVideo(null);
                            }
                        }}>
                            <PollIcon sx={{ color: mediumMain }} />
                            <Typography 
                                color={mediumMain}
                                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                            >
                                Poll
                            </Typography>
                        </FlexBetween>

                        {/* <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween> */}
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: "#3CA535",
                        borderRadius: "3rem",
                    }}
                >
                    Post
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default MyPostWidget;