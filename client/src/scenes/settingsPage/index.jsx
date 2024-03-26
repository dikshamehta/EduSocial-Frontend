import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Adsform from "../ADmanagement/ads";
import SettingsForm from "./settingsForm";
import { useNavigate } from 'react-router-dom';
 
const SettingsPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const navigate = useNavigate();
    const primaryLight = theme.palette.primary.light;
    const main = theme.palette.neutral.main;
 
    return (
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
 
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                {/* <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
                    Welcome to EduSocial, the Social Media Made for Education.
                   
                </Typography> */}
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
                    Privacy Settings
                </Typography>
                <SettingsForm />
            </Box>
        </Box>
    );
};
 
export default SettingsPage;