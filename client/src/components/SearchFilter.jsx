// import React from 'react';
// import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
// import { makeStyles } from '@mui/styles';
//
// const useStyles = makeStyles((theme) => ({
//     button: {
//         borderRadius: '20px', // Adjust the border radius as needed
//         padding: '8px 16px', // Adjust padding as needed
//         textTransform: 'none', // Preserve text case
//     },
// }));
//
// const Filter = ({ categories, selectedCategories, onChange }) => {
//     const classes = useStyles();
//
//     return (
//         <Box display="flex" flexDirection="row" gap="1rem" alignItems="center">
//             <span>Filter By:</span>
//             <ToggleButtonGroup
//                 value={selectedCategories}
//                 onChange={onChange}
//                 aria-label="filter categories"
//             >
//                 {categories.map((category) => (
//                     <ToggleButton key={category} value={category} className={classes.button}>
//                         {category}
//                     </ToggleButton>
//                 ))}
//             </ToggleButtonGroup>
//         </Box>
//     );
// };
//
// export default Filter;
//



import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

// Styled FilterContainer component
const FilterContainer = styled(Box)({
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
});

// Styled FormControl component
const StyledFormControl = styled(FormControl)({
    minWidth: 120,
    marginRight: '20px',
});

// Filter component
const Filter = ({ categories, selectedCategory, onChange }) => {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <FilterContainer>
            <StyledFormControl>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleChange}
                >
                    {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
        </FilterContainer>
    );
};

export default Filter;
