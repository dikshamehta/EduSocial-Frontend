import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    IconButton,
    InputBase,
    Switch,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Modal from '@mui/material/Modal';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import { create } from '@mui/material/styles/createTransitions';
import { useSelector } from 'react-redux';
import { Search } from '@mui/icons-material';
import { setBlockedUsers } from 'state';
import BlockedUserListWidget from '..//widgets/BlockedUserListWidget';

const serverURL = process.env.REACT_APP_SERVER_URL;

const initialValuesRegister = {
    blockedUsers: [],
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const BlockedForm = () => {
    const { _id } = useSelector((state) => state.user); //Get the user id from the state
    const userId = _id;
    const token = useSelector((state) => state.token); //Get the token from the state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ user, setUser ] = useState(null);
    const { palette } = useTheme();
    const neutralLight = palette.neutral.light;

    // const [pageType , setPageType] = useState("blocked");
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [ open, setOpen ] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigateToHomePage = () => navigate("/home");

    const getUser = async () => {
        const response = await fetch(`${serverURL}/user/${userId}`, { //API call
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        // console.log(data);
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null; //If user is not found, return null

    let {
        blockedUsers,
    } = user;

    const blockUser = async (blockedUserId) => {
        const response = await fetch(`${serverURL}/user/${userId}/${blockedUserId}/block`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Blocked User Data: ", data);
        dispatch(setBlockedUsers({ blockedUsers: data }));
    };

    const handleSearch = () => {
        let blockedUserId = document.getElementById("searchBox").value;
        blockUser(blockedUserId);
    }

    //Insert API Calls here (3)
    return (

        <Box
            display="grid"
            gap="15px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
            }}
        >
            <Typography 
                fontWeight="500" 
                variant="h5" 
                sx={{ gridColumn: "span 4"}}
            >
                Need to block someone? Enter their username below.
            </Typography>
            <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                padding="0.1rem 1.5rem"
                width="100%"
                sx={{ gridColumn: "span 4"}}
            >
                <InputBase placeholder="Search by username" id="searchBox" />
                <IconButton onClick={handleSearch}>
                    <Search />
                </IconButton>
            </FlexBetween>


            <Typography 
                fontWeight="500" 
                variant="h5"
                mt="1.5rem" 
                sx={{ gridColumn: "span 4"}}
            >
                Blocked Users
            </Typography>
            <BlockedUserListWidget userId={userId} />


        </Box>
        // <FlexBetween gap="1.75rem">

            

            // <Box
            //     display="flex"
            //     flexDirection="column"
            //     justifyContent="center"
            //     alignItems="left"
            //     gridColumn="span 4"
            // >
            //     <Typography variant="h5">Blocked Users</Typography>
            //     <Box>
            //         {blockedUsers.map((blockedUser) => (
            //             <Box key={blockedUser._id}>
            //                 <Typography>{blockedUser.username}</Typography>
            //             </Box>
            //         ))}
            //     </Box>
            // </Box>


        // </FlexBetween>

    );



};

export default BlockedForm;