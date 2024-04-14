import React, {useState} from "react";
import {Typography, Tooltip, Button, Box, Alert} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { Grid } from "@mui/material";
import PageImage from "components/PageImage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

const serverPort = process.env.REACT_APP_SERVER_PORT;


const PageExploreWidget = ({ page, alignItems = "center", gridWidth = "171.03px" }) => {
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [popupMessage, setPopupMessage] = useState(null); // State for popup message
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

  function navigateToPage(){
      const isMember = page.pageMembers.includes(_id);
      if (isMember) {
          navigate(`/page/${page._id}`);
      } else {
          setPopupMessage("You are not a member of this page.");
          setTimeout(() => {
              setPopupMessage(null);
          }, 5000);
      }
    }

  return (
    <WidgetWrapper>
      {/* Page information */}
      <Grid
        container
        direction="column"
        alignItems={alignItems}
        spacing={2}
        width={gridWidth}
        onClick={() => navigateToPage()}
        sx={{ cursor: "pointer" }}
      >
          {popupMessage && (
              <Box
                  position="fixed"
                  top="140px"
                  left="43vw"
                  transform="translateX(-50%)"
                  alignItems="center"
              >
                  <Alert severity="warning" sx={{ width: "auto", textAlign: "center" }}>
                      {popupMessage}
                  </Alert>
              </Box>
          )}
        <Typography variant="h6" color={dark}>
          {page.pageMembers.length}{" "}
          {page.pageMembers.length === 1 ? "Member" : "Members"}
        </Typography>
        <PageImage image={page.pagePicturePath} />
        <Tooltip title={page.pageName}>
          <Typography
            align={alignItems}
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
      <Box textAlign={alignItems}>
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
            onClick={async () => await joinPage().then(navigate(`/page/${page._id}`))}
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