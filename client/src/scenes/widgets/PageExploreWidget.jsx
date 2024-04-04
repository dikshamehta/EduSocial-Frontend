import React from "react";
import { Typography, Tooltip, Button, Box } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { Grid } from "@mui/material";
import PageImage from "components/PageImage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

const serverPort = process.env.REACT_APP_SERVER_PORT;

const PageExploreWidget = ({ page, navigateToPage }) => {
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const joinPage = async () => {
    try {
      await fetch(`http://localhost:${serverPort}/user/${_id}/joinPage/${page._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error following page:", error);
    }
  };

  return (
    <WidgetWrapper>
      {/* Page information */}
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        width="171.03px"
        onClick={() => navigateToPage(page._id)}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="h6" color={dark}>
          {page.pageMembers.length}{" "}
          {page.pageMembers.length === 1 ? "Member" : "Members"}
        </Typography>
        <PageImage image={page.pagePicturePath} />
        <Tooltip title={page.pageName}>
          <Typography
            align="center"
            width="100%"
            variant="h4"
            color={dark}
            fontWeight="500"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {page.pageName}
          </Typography>
        </Tooltip>
        <Typography variant="h5" color={medium}>
          {page.pageType.charAt(0).toUpperCase() + page.pageType.slice(1)}
        </Typography>
      </Grid>
      <Box textAlign="center">
        {page.pageMembers.includes(_id) ? (
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => navigate(`/page/${page._id}`)}
            sx={{ mt: "15px" }}
          >
            {"Joined"}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={async () => await joinPage().then(navigate(page._id))}
            sx={{ mt: "15px", zIndex: 9999 }}
          >
            {"Join Page"}
          </Button>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default PageExploreWidget;