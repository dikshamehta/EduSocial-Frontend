import { Box, Typography, Divider, useTheme, Button, Menu, MenuItem, Tooltip, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import PageImage from "components/PageImage";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from "@mui/material/IconButton";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { red } from "@mui/material/colors";
const serverURL = process.env.REACT_APP_SERVER_URL;
const PageSidebarWidget = ({ pageId, picturePath }) => {
  const [page, setPage] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandSettings, setExpandSettings] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openDonateDialog, setOpenDonateDialog] = useState(false);

  const getPage = async () => {
    try {
      const response = await fetch(`${serverURL}/page/${pageId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPage(data);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  const leavePage = async () => {
    try {
      const response = await fetch(
        `${serverURL}/user/${userId}/leavePage/${pageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        console.error("Error leaving page:", data.error);
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error leaving page:", error);
    }
  };

  useEffect(() => {
    getPage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!page) return null;

  let { pageName, pageType, pageDescription, pagePicturePath } = page;
  pageType = pageType.charAt(0).toUpperCase() + pageType.slice(1); // Make pageType first letter uppercase

  let truncatedDescription = pageDescription;
  if (pageDescription.length > 35 && !isExpanded) {
    truncatedDescription = pageDescription.slice(0, 35) + "...";
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleSettings = (event) => {
    // Added event parameter
    setExpandSettings(event.currentTarget); // Set anchorEl to event.currentTarget
  };

  const handleLeave = () => {
    setOpenLeaveDialog(true); // Open leave confirmation dialog
    setExpandSettings(null); // Close settings menu
  };

  const handleConfirmLeave = () => {
    // Leave page
    leavePage();
    setOpenLeaveDialog(false);
  };

  const handleCloseLeaveDialog = () => {
    setOpenLeaveDialog(false);
  };

  const handleDonate = () => {
    setOpenDonateDialog(true);
  };

  const handleCloseDonateDialog = () => {
    setOpenDonateDialog(false);
  };

  return (
    <WidgetWrapper height="100%">
      {/* Page information */}
      <Grid
        container
        direction="column"
        alignItems="center"
        width="100%"
        minWidth="200px"
        maxWidth="200px"
        spacing={2}
      >
        <Grid item sx={{ position: "relative", width: "100%" }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            color="dark"
            onClick={handleToggleSettings}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={expandSettings}
            open={Boolean(expandSettings)}
            onClose={() => setExpandSettings(null)} // Close menu on close
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {page.userId === userId && (
              <MenuItem onClick={() => navigate(`/page/${page._id}/settings`)}>
                Advanced
              </MenuItem>
            )}
            <MenuItem
              onClick={handleLeave}
              sx={{ color: palette.background.alt, backgroundColor: red[900] }}
            >
              Leave
            </MenuItem>
          </Menu>
        </Grid>
        <Grid item>
          <PageImage image={pagePicturePath} />
        </Grid>
        <Grid item>
          <Tooltip title={pageName}>
            <Typography
              variant="h4"
              color="dark"
              fontWeight="500"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px", // Add this line to limit the width
              }}
            >
              {pageName}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography color="neutral.medium">{pageType}</Typography>
        </Grid>
        <Grid item>
          <Typography color="neutral.medium" pt="10px">
            {truncatedDescription}
            {!isExpanded && pageDescription.length > 35 && (
              <Button onClick={handleToggleExpand} color="primary">
                Read More
              </Button>
            )}
            {isExpanded && (
              <Button onClick={handleToggleExpand} color="primary">
                Show Less
              </Button>
            )}
          </Typography>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider />

      {/* Donate Button */}
      <Box mt="15px" textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleDonate}
          sx={{ backgroundColor: palette.primary.main }}
        >
          {"Donate"}
        </Button>
      </Box>

      {/* Leave confirmation dialog */}
      <Dialog open={openLeaveDialog} onClose={handleCloseLeaveDialog}>
        <DialogTitle>Confirm Leave</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to leave?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLeave} color="primary">
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Donation dialog */}
      <Dialog
        open={openDonateDialog}
        onClose={handleCloseDonateDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Donate</DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <Typography variant="h6">Donate to support this page</Typography>
            <form>
              <Box mt={2}>
                <TextField
                  id="cardNumber"
                  label="Credit Card Number"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={2}>
                <TextField
                  id="cardName"
                  label="Name on Card"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={2} display="flex" justifyContent="space-between">
                <TextField
                  id="expiry"
                  label="Expiry Date (MM/YY)"
                  variant="outlined"
                  fullWidth
                />
                <TextField id="cvv" label="CVV" variant="outlined" fullWidth />
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCloseDonateDialog}
                >
                  Donate
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDonateDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PageSidebarWidget;