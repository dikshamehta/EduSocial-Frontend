import { Box, Typography } from "@mui/material";
import Form from "./Form";
import NavBar from "scenes/navbar";
import { useParams } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

const PageSettingsPage = () => {
  const { pageId } = useParams();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <NavBar />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Page Settings
        </Typography>
        <Form pageId={pageId} />
      </Box>
    </Box>
  );
};

export default PageSettingsPage;
