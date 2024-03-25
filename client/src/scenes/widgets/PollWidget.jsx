import { useEffect, useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';

const PollWidget = ({ parentId }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [pollData, setPollData] = useState({});
    const [hasVoted, setHasVoted] = useState(false);

    const token = useSelector((state) => state.token);
    
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        console.log(selectedOption);
        const response = await fetch(`http://localhost:5000/posts/${parentId}/poll`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option: selectedOption })
        });
        const data = await response.json();

        setHasVoted(true);
        setPollData(data);
    }

    const getPollData = async () => {
        const response = await fetch(`http://localhost:5000/posts/${parentId}/poll`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        setPollData(data);
    };

    useEffect(() => {
        getPollData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
        <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold">Poll</Typography>
            <Typography variant="h5" sx={{ mt: "10px" }}>{pollData.question}</Typography>
            <FormControl component="fieldset">
                <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                    {pollData.options?.map((option) => (
                        <FormControlLabel
                            key={option.option}
                            value={option.option}
                            control={<Radio />}
                            label={option.option}
                            disabled={hasVoted} // Disable radio buttons after user has voted
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            {hasVoted && (
                <Box mt={2}>
                    {pollData.options?.map((option) => (
                        <Box key={option.option} mb={1}>
                            <Typography>{option.option}</Typography>
                            <LinearProgress variant="determinate" value={(option.votes / pollData.totalVotes) * 100} />
                            <Typography>{`${option.votes} ${option.votes > 1 || option.votes === 0 ? "votes" : "vote"}`}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
            <Divider />
            {!hasVoted && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: "10px" }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            )}
        </Box>
    </WidgetWrapper>
    );
};

export default PollWidget;