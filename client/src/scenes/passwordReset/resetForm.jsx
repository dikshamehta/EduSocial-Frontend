import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const serverURL = process.env.REACT_APP_SERVER_URL;

const PasswordForm = ({ jsonToken }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
        } else {
          setPasswordError("");
          setPasswordSuccess("");
          await resetPassword();
        }
    };

    const resetPassword = async () => {
        try {
            const res = await fetch(`${serverURL}/user/resetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "password": password, "token": jsonToken }),
            });

            const data = await res.json();
            data === true ? setPasswordSuccess("Password reset successful.") : setPasswordError("Password reset failed.");

        } catch (err) {
            setPasswordError("Something went wrong. Please try again later.");
        }
    };

    return (
      <Box>
        <form onSubmit={handlePasswordSubmit}>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
          <Typography color="success">{passwordSuccess}</Typography>
        </form>
      </Box>
    );
};

export default PasswordForm;