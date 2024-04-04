import { useEffect, useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Divider } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';

const serverPort = process.env.REACT_APP_SERVER_PORT;

const PollWidget = ({ parentId }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [pollData, setPollData] = useState({});
    const [hasVoted, setHasVoted] = useState(false);

    const userId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        await fetch(`http://localhost:${serverPort}/polls/${parentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ option: selectedOption, userId: userId})
        });
        getPollData();
        setHasVoted(true);
    };

    const getPollData = async () => {
        try {
            const response = await fetch(`http://localhost:${serverPort}/polls/${parentId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (!data.options) {
              throw new Error('ERROR: POLL DATA NOT FOUND');
            }
            if (data.voters.includes(userId)) {
              setHasVoted(true);
            }
            setPollData(data);
        } catch (error) {
            console.error('Error fetching poll data:', error);
            setPollData({}); // Clear poll data if error occurs
          return (
              <Typography variant="h4">{error}</Typography>
          );
        }
    };

    useEffect(() => {
        getPollData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <WidgetWrapper>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            Poll
          </Typography>
          <Typography variant="h5" sx={{ mt: "10px" }}>
            {pollData.question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {pollData.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
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
              {pollData.options?.map((option, index) => (
                <Box key={option.option} mb={1}>
                  <Typography>{option.option}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(option.votes / pollData.totalVotes) * 100}
                  />
                  <Typography>{`${option.votes} ${
                    option.votes > 1 || option.votes === 0 ? "votes" : "vote"
                  }`}</Typography>
                </Box>
              ))}
            </Box>
          )}
          <Divider />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={selectedOption === "" || hasVoted}
            sx={{ mt: "10px" }}
          >
            Submit
          </Button>
        </Box>
      </WidgetWrapper>
    );
};

export default PollWidget;