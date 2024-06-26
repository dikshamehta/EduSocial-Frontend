//Where we do register functionality
import { useState,useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

const serverPort = process.env.REACT_APP_SERVER_PORT;

const registerSchema = yup.object().shape({ //Registration validation schema
    username: yup.string().required("Username is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    picture: yup.string().required("Profile picture is required"),
});

const loginSchema = yup.object().shape({ //Login validation schema - use email and password
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    picture: "",
    displayTag: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};


//Display tag implementation
const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

const Tab = styled.button`
padding: 10px 30px;
cursor: pointer;
opacity: 0.6;
background: white;
border: 0;
outline: 0;
border-bottom: 2px solid transparent;
transition: ease border-bottom 250ms;
${({ active }) =>
  active &&
  `
  border-bottom: 2px solid black;
  opacity: 1;
`}
`;

//Use pereventDefault for Tab
// Tab.defaultProps = {
//   onClick: (e) => e.preventDefault(),
// };


const types = ["Default", "Business", "Technology", "Humor", "John Cena"];





const Form = () => {
    const [pageType, setPageType] = useState("login"); //Default page type is login - display different form based on state
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const mediumMain = palette.neutral.mediumMain;

    const [ displayTag, setDisplayTag ] = useState(""); //Represent the switch whether someone has clicked tag button
    const [ active , setActive ] = useState(null); //Represent the tag that is clicked

    // ReCAPTCHA
    const recaptcha = useRef();

    // Oauth
        const [value, setValue] = useState("");

        const handleClick = () => {
          signInWithPopup(auth, provider)
            .then(async (data) => {
              // const token = await data.user.getIdToken(); // Get the OAuth token from the user data
              console.log("DATA", data);
              // Store user's email locally (you're already doing this)
              localStorage.setItem("email", data.user.email);

              const idToken = await data.user.getIdToken(); // The ID token is used to authenticate against your own backend

              // Extract the necessary information from the Firebase user object
              const userProfile = {
                email: data.user.email,
                displayName: data.user.displayName,
                photoURL: data.user.photoURL,
                uid: data.user.uid,
                token: idToken, // Send the ID token along with the user profile
              };

              // Now send the token to your backend for verification and processing at the updated endpoint
              console.log("Sending data to backend");
              const response = await fetch(
                `http://localhost:${serverPort}/auth/google-login`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ userProfile }), // Send the token as JSON
                }
              );
              console.log("SENT");
              const backendResponse = await response.json(); // Assuming your backend sends back JSON
              console.log("BACKEND RESPONSE:", backendResponse);

              if (backendResponse.success) {
                // Handle successful authentication with your backend here
                console.log(
                  "Successfully authenticated with backend using Google OAuth."
                );
                // login action dispatched
                dispatch(
                  setLogin({
                    user: backendResponse.user,
                    token: backendResponse.token,
                  })
                );
                navigate("/home");

                // You might want to navigate the user to the home page or store the backend's response token, for example
              } else {
                // Handle any errors or issues here
                console.log(
                  "Authentication with backend using Google OAuth failed."
                );
              }
            })
            .catch((error) => {
              // Handle any errors in the signInWithPopup process here
              console.error("Error during Google sign-in", error);
            });
        };

        useEffect(() => {
          setValue(localStorage.getItem("email"));
        }, []);

    const register = async (values, onSubmitProps) => { //Allows us to use form data to register
      const captchaVerified = await verifyCaptcha();
      if (!captchaVerified) {
        alert("Captcha verification failed. Please try again.");
      } else {
        const formData = new FormData(); //Allows us to use image with form info.
        for (let value in values) {
          //Loops through values and appends
          console.log("VALUE", value);
          formData.append(value, values[value]);
        }
        console.log("PICTURE", values.picture.name);
        console.log("DISPLAY TAG", displayTag);

        formData.append("picturePath", values.picture.name);
        formData.append("displayTag", displayTag); //Appends display tag to form data

        console.log("FORM DATA", formData);

        const savedUserResponse = await fetch(
          //Sending form data to this API call
          `http://localhost:${serverPort}/auth/register`,
          {
            method: "POST",
            body: formData,
          }
        );
        const savedUser = await savedUserResponse.json(); //Converts response to JSON
        onSubmitProps.resetForm(); //Resets form
        setActive(null); //Resets active tag
        setDisplayTag(""); //Resets display tag

        if (savedUser) {
          setPageType("login"); //Redirects to login page
        }
      }
    };

    const login = async (values, onSubmitProps) => {
      const captchaVerified = await verifyCaptcha();
      if (!captchaVerified) {
        alert("Captcha verification failed. Please try again.");
      } else {
        const loggedInResponse = await fetch(
          `http://localhost:${serverPort}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values), //Already formatted
          }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm(); //Resets form
        if (loggedIn) {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            })
          );
          navigate("/home"); //Navigates to home page
        }
      }
    };

    const verifyCaptcha = async () => {
      const captchaValue = recaptcha.current.getValue();

      if (captchaValue) {
        const response = await fetch(
          `http://localhost:${serverPort}/auth/captcha`,
          {
            method: "POST",
            body: JSON.stringify({ token: captchaValue }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const captchaResponse = await response.json();
        if (captchaResponse.success) {
          console.log("Captcha verified");
          return true;
        } else {
          console.log("Captcha failed");
          return null;
        }
      } else {
        console.log("Captcha not verified");
        return null;
      }
    };

    const refreshCaptcha = () => {
      recaptcha.current.reset();
    };

    const handleFormSubmit = async (values, onSubmitProps) => { //Handles form submission
        if (isLogin) await login(values, onSubmitProps); //Calls login function
        if (isRegister) await register(values, onSubmitProps); //Calls register function
    };

    return (
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={
                      Boolean(touched.username) && Boolean(errors.username)
                    }
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
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
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${"#3CA535"}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
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
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Display tag */}
              {isRegister && (
                <>
                  <FlexBetween sx={{ gridColumn: "span 4" }} gap="1rem">
                    <Typography color={mediumMain}>
                      Choose an option to customize your feed:
                    </Typography>
                  </FlexBetween>
                  <FlexBetween
                    alignContent={"center"}
                    justifyContent={"center"}
                    ml="10rem"
                    mt="-1rem"
                    sx={{ gridColumn: "span 4" }}
                  >
                    <>
                      <div>
                        {types.map((type) => (
                          <Tab
                            key={type}
                            active={active === type}
                            onClick={(e) => {
                              e.preventDefault();
                              setActive(type);
                              setDisplayTag(String(type));
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {type}
                          </Tab>
                        ))}
                      </div>
                      <p />
                    </>
                  </FlexBetween>
                </>
              )}
            </Box>

            {/* Buttons */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: "2rem" }}>
                <ReCAPTCHA
                  ref={recaptcha}
                  sitekey={process.env.REACT_APP_SITE_KEY}
                />
              </Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: "#3CA535",
                  color: palette.background.alt,
                  "&:hover": { color: "#3CA535" },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Button
                fullWidth
                // type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: "#3CA535",
                  color: palette.background.alt,
                  "&:hover": { color: "#3CA535" },
                }}
                onClick={handleClick}
              >
                {isLogin
                  ? "LOGIN / Sign in with GOOGLE"
                  : "REGISTER with GOOGLE"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                  refreshCaptcha();
                }}
                sx={{
                  textDecoration: "underline",
                  color: "#3CA535",
                  "&:hover": {
                    cursor: "pointer",
                    color: "#B9F0B8",
                  },
                }}
              >
                {isLogin
                  ? "New? Register here"
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    );
};

export default Form;