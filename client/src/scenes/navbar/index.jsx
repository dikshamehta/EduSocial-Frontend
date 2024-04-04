import { useState } from 'react';
import { 
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { 
    Search,
    Message,
    DarkMode,
    LightMode,
    Article,
    Notifications,
    // Help, 
    Menu, 
    Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout, setSearchResults } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import NotificationWindowWidget from 'scenes/widgets/NotificationWindowWidget';

const NavBar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); //For small screens
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme(); //Use any of the set themes
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const main = theme.palette.neutral.main;
    const alt = theme.palette.background.alt;

    const fullName = `${user.firstName} ${user.lastName}`; //Access to full name!
    // const fullName = `first last`; //Test
    const serverPort = process.env.REACT_APP_SERVER_PORT;

    const getSearchResults = async (query) => {
        const response = await fetch(`http://localhost:${serverPort}/search/`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'search_string': `${query}`
            })
        });
        let searchData = await response.json();
        let searchResults = {
            'posts': searchData.posts,
            'people': searchData.users,
            'pages': []
        };
        console.log(searchResults);
        dispatch(setSearchResults(searchResults));
    }

    const handleSearch = () => {
        let query = document.getElementById("searchBox").value;
        getSearchResults(query, token);
        navigate("/search");
    }

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const toggleNotifications = async () => {
      setIsNotificationsOpen(!isNotificationsOpen);
    };

    const handleNotificationClick = (event) => {
      setNotificationAnchorEl(event.currentTarget);
      toggleNotifications();
    };

    return (
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="#3CA535"
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
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search" id="searchBox" />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? ( //Toggle between light and dark mode
          <FlexBetween gap="2rem">
            <IconButton onClick={(event) => handleNotificationClick(event)}>
              <Notifications sx={{ fontSize: "25px", color: dark }} />
            </IconButton>
            <IconButton onClick={() => navigate("/page")}>
              <Article sx={{ fontSize: "25px", color: dark }} />
            </IconButton>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            {/* <Help sx={{ fontSize: "25px" }} /> */}
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography onClick={() => navigate("/settings")}>
                    Settings
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />
              {/* <Help sx={{ fontSize: "25px" }} /> */}
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography onClick={() => navigate("/settings")}>
                      Settings
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
        {isNotificationsOpen && (
          <NotificationWindowWidget
            onClose={toggleNotifications}
            anchorEl={notificationAnchorEl}
          />
        )}
      </FlexBetween>
    );



};
export default NavBar;