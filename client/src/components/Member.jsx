import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "./UserImage";

const Member = ({ memberId, name, userPicturePath }) => {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const main = palette.neutral.main;

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${memberId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                </Box>
            </FlexBetween>
        </FlexBetween>
    );
};

export default Member;