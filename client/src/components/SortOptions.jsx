import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const SortingOptions = ({ sortValue, sortOptions, onSortChange }) => {
    return (
        <FormControl sx={{ minWidth: 120}}>
            <InputLabel id="sorting-options-label">Sort By</InputLabel>
            <Select
                labelId="sorting-options-label"
                id="sorting-options-select"
                value={sortValue}
                onChange={onSortChange}
                label="Sort By"
                sx = {{ height: 25 }}

            >
                {sortOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default SortingOptions;
