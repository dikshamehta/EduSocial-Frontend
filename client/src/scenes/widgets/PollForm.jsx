import * as yup from 'yup';
import { useState } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


export const pollFormSchema = yup.object().shape({
    question: yup.string().required("Question is required"),
    options: yup.array().of(yup.string().required("Option is required")).min(2, "Minimum of 2 options required"),
});

const initialPollFormValues = {
    question: "",
    options: [""],
};

const Form = ({ getFormData }) => {
    const [pollFormValues, setPollFormValues] = useState(initialPollFormValues);
    const [pollFormErrors, setPollFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isOptions, setIsOptions] = useState(false);

    const handleAddOption = () => {
        setPollFormValues((prev) => ({
            ...prev,
            options: [...prev.options, ""],
        }));
        getFormData(pollFormValues);
    };

    const handleRemoveOption = (index) => {
        setPollFormValues((prev) => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }));
        getFormData(pollFormValues);
    };

    const handlePollFormChange = (e) => {
        const { name, value } = e.target;
        setPollFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        getFormData(pollFormValues);
    };

    const handleOptionChange = (e, index) => {
        const { value } = e.target;
        setPollFormValues((prev) => ({
            ...prev,
            options: prev.options.map((option, i) => (i === index ? value : option)),
        }));
        getFormData(pollFormValues);
    };

    const handlePollFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await pollFormSchema.validate(pollFormValues, { abortEarly: false });
            getFormData(pollFormValues); // Call the function to send form data to the parent
            setPollFormErrors({});
        } catch (err) {
            const errors = err.inner.reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});
            setPollFormErrors(errors);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handlePollFormSubmit}>
            <Box display="flex" flexDirection="column" gap="1rem">
                <TextField
                    label="Question"
                    name="question"
                    value={pollFormValues.question}
                    onChange={handlePollFormChange}
                    error={Boolean(pollFormErrors.question)}
                    helperText={pollFormErrors.question}
                />
                <Box display="flex" flexDirection="column" gap="1rem">
                    {pollFormValues.options.map((option, index) => (
                        <Box display="flex" gap="1rem" key={index}>
                            <TextField
                                label={`Option ${index + 1}`}
                                name="options"
                                value={option}
                                onChange={(e) => handleOptionChange(e, index)}
                                error={Boolean(pollFormErrors.options && pollFormErrors.options[index])}
                                helperText={pollFormErrors.options}
                            />
                            <IconButton onClick={() => handleRemoveOption(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Button variant="outlined" onClick={handleAddOption}>
                    Add Option
                </Button>
            </Box>
        </form>
    );
}

export default Form;