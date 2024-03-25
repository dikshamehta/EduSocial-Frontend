//Where we do register functionality
import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
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
 
 
 
 
const adSchema = yup.object().shape({ //Registration validation schema
    companyname: yup.string().required("Company name is required"),
    companywebsite: yup.string().required("Company website is required"),
    description: yup.string().required("Description is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    picture: yup.string().required("Ad picture is required"),
});
 
const initialValuesRegister = {
    companyname: "",
    companywebsite: "",
    description: "",
    email: "",
    picture: "",
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
 
 
const Adsform = () => {
    //const isAuth = Boolean(useSelector((state) => state.token)); //Checks if user is logged in - authorized if token exists
    const [pageType, setPageType] = useState("register"); //Default page type is login - display different form based on state
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    // const [togglePopup,setTogglePopup] = useState(false);
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        console.log(adSchema)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);
    const isRegister = pageType === "register";
    const navigateToHomePage = () => {
            navigate('/home');
    }
 
    // const register = async (values, onSubmitProps) => { //Allows us to use form data to register
    //     const formData = new FormData(); //Allows us to use image with form info.
    //     for (let value in values) { //Loops through values and appends
    //         formData.append(value, values[value]);
    //     }
    //     formData.append("picturePath", values.picture.name);
 
    //     onSubmitProps.resetForm(); //Resets form
    // };

    const createAd = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        formData.append("picture", values.picture.name);

        console.log(formData);
        const savedAdResponse = await fetch(
            "http://localhost:5000/ads", 
            {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const savedAdData = await savedAdResponse.json();
        //console.log(savedAdData);

        if (savedAdData) {
            handleOpen();
            onSubmitProps.resetForm();
        }

    };

 
 
    // const handleFormSubmit = async (values, onSubmitProps) => { //Handles form submission
    //     console.log('Hi');
    //     console.log(open);
    //     // if (isRegister) await register(values, onSubmitProps); //Calls register function
    //     handleOpen();
 
    // };
 
    return (
        <Formik
            onSubmit={createAd}
            initialValues={initialValuesRegister}
            validationSchema={adSchema}
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
                                <TextField
                                    label="Company Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.companyname}
                                    name="companyname"
                                    error={Boolean(touched.companyname) && Boolean(errors.companyname)}
                                    helperText={touched.companyname && errors.companyname}
                                    sx={{ gridColumn: "span 4" }}
                                />
                               
                                <TextField
                                    label="Company Website"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.companywebsite}
                                    name="companywebsite"
                                    error={Boolean(touched.companywebsite) && Boolean(errors.companywebsite)}
                                    helperText={touched.companywebsite && errors.companywebsite}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={Boolean(touched.description) && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) =>
                                            setFieldValue("picture", acceptedFiles[0])
                                        }
                                    >
                                        {({ getRootProps, getInputProps}) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                sx={{ "&:hover": { cursor: "pointer"} }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add Picture Here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>{values.picture.name}</Typography>
                                                        <EditOutlinedIcon />
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}
                       
                        <TextField
                            label="Contact Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                       
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
                            {"Request AD"}
 
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                   Ad request sent. You will be contacted shortly.
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
                                    onClick={navigateToHomePage}                                  
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
 
export default Adsform;