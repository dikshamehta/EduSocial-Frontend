import React, { useEffect, useState } from "react";
import { Alert, Box, Tooltip, Typography, useTheme } from "@mui/material";
import NavBar from "scenes/navbar";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import PageExploreWidget from "scenes/widgets/PageExploreWidget";
import Select from "react-select";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import pageTypes from "components/PageTypes";

const serverPort = process.env.REACT_APP_SERVER_PORT;
const PageExplorePage = () => {
  const [pages, setPages] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null); // State for popup message
  const userId = useSelector((state) => state.user._id);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();

  const getAllPages = async () => {
    try {
      const response = await fetch(`http://localhost:${serverPort}/page`, {
        method: "GET",
      });
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  useEffect(() => {
    getAllPages();
  }, []);

  if (!pages) return null;

  const options = pageTypes.map((type) => {
    return { label: type.charAt(0).toUpperCase() + type.slice(1), value: type };
  });

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions.map((option) => option.value));
  };

  return (
    <Box>
      <NavBar />
      <Box display="flex" justifyContent="center" height="auto">
        <Tooltip title="Create a new page" placement="bottom">
          <IconButton
            onClick={() => navigate("/page/create")}
            sx={{
              m: "0.5rem 0",
              p: "0.5rem",
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter pages" placement="bottom">
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              m: "0.5rem 0",
              p: "0.5rem",
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" justifyContent="center" height="20px">
        {showFilters && (
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
            styles={{
              container: (provided) => ({
                ...provided,
                width: isNonMobileScreens ? "10%" : "50%",
              }),
            }}
          />
        )}
      </Box>
      {pages.length !== 0 ? (
        <Grid
          container
          direction="row"
          padding="3rem"
          alignItems="center"
          justifyContent="center"
          spacing={3}
        >
          {pages.map((page) => {
            if (
              selectedFilters.includes(page.pageType) ||
              selectedFilters.length === 0
            ) {
              return (
                <Grid item key={page._id}>
                  <PageExploreWidget
                    page={page}
                  />
                </Grid>
              );
            }
          })}
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Typography variant="h4">No pages yet</Typography>
        </Box>
      )}
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
    </Box>
  );
};

export default PageExplorePage;