import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import EmailForm from "./emailForm";
import PasswordForm from "./resetForm";
import { useParams } from "react-router-dom";

const ForgotPasswordPage = ( {formType}) => {
    const { jwt } = useParams();
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    //const 

    return (
        <Box>
            <Box 
                width="100%" 
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="#3CA535">
                    EduSocial
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
                    Reset your password.
                </Typography>
                {formType === "email" ? <EmailForm /> : <PasswordForm jsonToken={jwt} />}
            </Box>
        </Box>
    );
};

export default ForgotPasswordPage;