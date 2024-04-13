import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const serverURL = process.env.REACT_APP_SERVER_URL;

const EmailForm = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setEmailSuccess("");
        await verifyEmail();
    };

    const verifyEmail = async () => {
        try {
            const res = await fetch(`${serverURL}/user/email/${email}`, {
                method: "GET",
            });

            const data = await res.json();
            
            data ? setEmailSuccess("Email found. Check email for password reset link.") : setEmailError("Email not found.");

        } catch (err) {
            if (err.status === 404) {
                setEmailError("Email not found.");
            } else {
                setEmailError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
      <Box>
        <form onSubmit={handleEmailSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
        <Box sx={{ mt: "1.5rem", display: "flex", justifyContent: "center" }}>
          <Typography color="success">{emailSuccess}</Typography>
        </Box>
      </Box>
    );
};

export default EmailForm;