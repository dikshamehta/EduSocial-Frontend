//Where we do register functionality
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
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
 
 
 
 
// const adSchema = yup.object().shape({ //Registration validation schema
//     companyname: yup.string().required("Company name is required"),
//     companywebsite: yup.string().required("Company website is required"),
//     description: yup.string().required("Description is required"),
//     email: yup.string().email("Invalid email").required("Email is required"),
//     picture: yup.string().required("Ad picture is required"),
// });

const serverPort = process.env.REACT_APP_SERVER_PORT;

const initialValuesRegister = {
    profilePrivacy: false,
    emailPrivacy: false,
    recentPostOrder: false,
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
 
 
const SettingsForm = () => {
    const { _id } = useSelector((state) => state.user); //Gets user id from state
    const userId  = _id;
    const token = useSelector((state) => state.token); //Gets token from state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ user, setUser ] = useState(null); //Grabs user from the backend
    
    //const isAuth = Boolean(useSelector((state) => state.token)); //Checks if user is logged in - authorized if token exists
    const [pageType, setPageType] = useState("register"); //Default page type is login - display different form based on state
    const { palette } = useTheme();
    // const [togglePopup,setTogglePopup] = useState(false);
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        // console.log(adSchema)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);
    const isRegister = pageType === "register";
    const navigateToHomePage = () => {
        navigate('/home');
    }

    const getUser = async () => {
        const response = await fetch(`http://localhost:${serverPort}/user/${userId}`, { //API call
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => { //When you enter this page, because we have empty array, getUser will be called and component gets rendered when you first get to pag 
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null; //If user is not found, return null

    let { //Destructuring user object
        profilePrivacy,
        emailPrivacy,
        recentPostOrder,
    } = user;
 
    let isProfilePrivacy = false;
    let isEmailPrivacy = false;
    if (profilePrivacy) {
        isProfilePrivacy = true;
    }
    if (emailPrivacy) {
        isEmailPrivacy = true;
    }



    const changeSettings = async (values, onSubmitProps) => {
        const formData = new FormData();
        // let profilePrivacy = document.getElementById("profilePrivacy");
        // let emailPrivacy = document.getElementById("emailPrivacy");

        console.log("Profile Privacy: " + profilePrivacy);
        console.log("Email Privacy: " + emailPrivacy);
        console.log("Recent Post Order: " + recentPostOrder);

        //Create JSON format for the data
        const data = {
            profilePrivacy: profilePrivacy,
            emailPrivacy: emailPrivacy,
            recentPostOrder: recentPostOrder,
        };



        // console.log(data);
        // console.log(JSON.stringify(data));

        const savedSettingsResponse = await fetch(
            `http://localhost:${serverPort}/user/${_id}/changeSettings`,
            {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",

                },
                
                
            }
        );
        const savedUserData = await savedSettingsResponse.json();
        // console.log(savedUserData);

        if (savedUserData) {
            handleOpen();
            onSubmitProps.resetForm();
            dispatch(setUser({ user: savedUserData }));
        

            //Rerender the home page


        }


    };

    const changeProfilePrivacy = async () => {
        profilePrivacy = !profilePrivacy;
    };
    const changeEmailPrivacy = async () => {
        emailPrivacy = !emailPrivacy;
    };
    const changeRecentPostOrder = async () => {
        recentPostOrder = !recentPostOrder;
    };

 
 
    // const handleFormSubmit = async (values, onSubmitProps) => { //Handles form submission
    //     console.log('Hi');
    //     console.log(open);
    //     // if (isRegister) await register(values, onSubmitProps); //Calls register function
    //     handleOpen();
 
    // };
 
    return (
        <Formik
            onSubmit={changeSettings}
            initialValues={initialValuesRegister}
            // validationSchema={adSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        {isRegister && (
                            <>
                                <Typography font-style="italic" fontWeight="500" variant="h5" sx={{ mb: "-1rem"}}>
                                    Privacy Settings
                                </Typography>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="left"
                                    gridColumn="span 4"
                                >
                                    <Typography fontSize="14px" fontWeight="bold" position="relative">Profile Privacy</Typography>
                                    <Box display="flex" mt="0.5rem" position="relative">
                                        <Typography mt="0.55rem">Public</Typography>
                                        <Switch 
                                            defaultChecked={profilePrivacy}
                                            value={profilePrivacy}
                                            onChange={handleChange}
                                            id="profilePrivacy"
                                            onClick={changeProfilePrivacy}
                                        />
                                        <Typography mt="0.55rem">Private</Typography>
                                    </Box>
                                </Box>

                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="left"
                                    gridColumn="span 4"
                                    
                                >
                                    <Typography fontSize="14px" fontWeight="bold" position="relative" mt="-1rem">Email Privacy</Typography>
                                    <Box display="flex" mt="0.5rem" position="relative">
                                        <Typography mt="0.55rem">Public</Typography>
                                        <Switch 
                                            defaultChecked={emailPrivacy}
                                            id="emailPrivacy"
                                            value={emailPrivacy}
                                            onChange={handleChange}
                                            onClick={changeEmailPrivacy}
                                        />
                                        <Typography mt="0.55rem">Private</Typography>
                                    </Box>
                                </Box>


                                <Typography font-style="italic" fontWeight="500" variant="h5" sx={{ mb: "-1rem"}}>
                                    Content Settings
                                </Typography>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="left"
                                    gridColumn="span 4"
                                >
                                    <Typography fontSize="14px" fontWeight="bold" position="relative">Feed Order</Typography>
                                    <Box display="flex" mt="0.5rem" position="relative">
                                        <Typography mt="0.55rem">Recent</Typography>
                                        <Switch 
                                            defaultChecked={recentPostOrder}
                                            value={recentPostOrder}
                                            onChange={handleChange}
                                            id="recentPostOrder"
                                            onClick={changeRecentPostOrder}
                                        />
                                        <Typography mt="0.55rem">Algorithm</Typography>
                                    </Box>
                                </Box>
                                {/* <Typography fontSize="14px" fontWeight="bold" position="relative" mt="8rem">Email Privacy</Typography>
                                <Box display="flex" mt="10rem" position="relative">
                                    <Typography mt="0.55rem">Public</Typography>
                                    <Switch 
                                        defaultChecked={emailPrivacy}
                                        id="emailPrivacy"
                                        value={emailPrivacy}
                                        onChange={handleChange}
                                        onClick={changeEmailPrivacy}
                                    />
                                    <Typography mt="0.55rem">Private</Typography>
                                </Box> */}
                                
                               
                                
                                
                                
                            </>
                        )}
                    </Box>
 
 
                    {/* Buttons */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                            //onClick={handleOpen}
                        >
                            {"Save Changes"}
 
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                   Settings have been saved.
                                    </Typography>
                                    <Button
                                    fullWidth
                                    sx={{
                                        m: "2rem 0",
                                        p: "1rem",
                                        backgroundColor: palette.primary.main,
                                        color: palette.background.alt,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                    onClick={ () => {
                                        handleClose();
                                        // this.forceUpdate();
                                        navigateToHomePage();

                                    }}                                  
                                    >
                                    {"Home Page"}
                                    </Button>
                                </Box>
                                </Modal>
                        </Button>
                        {/* <Typography
                            onClick={() => {
                                setPageType("login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                }
                            }}
                        >
                            {/* {isLogin ? "New? Register here" : "Already have an account? Login here."} */}
                        {/* </Typography> */}
                    </Box>
                </form>
            )}
        </Formik>
    );
};
 
export default SettingsForm;