import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const SortingOptions = ({ sortValue, onSortChange }) => {
    return (
        <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="sorting-options-label">Sort By</InputLabel>
            <Select
                labelId="sorting-options-label"
                id="sorting-options-select"
                value={sortValue}
                onChange={onSortChange}
                label="Sort By"
            >
                <MenuItem value="ascending">Ascending</MenuItem>
                <MenuItem value="descending">Descending</MenuItem>
            </Select>
        </FormControl>
    );
};

export default SortingOptions;
