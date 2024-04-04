import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {useDispatch, useSelector} from "react-redux";
import {setFilterResults} from "../state";

// TODO: remove middle variable filter result

function SearchFilter() {
    const filterResults = useSelector((state)=>state.filterResults);
    const searchResults = useSelector((state)=>state.searchResults);
    const dispatch = useDispatch();

    const [value, setValue] = useState(0);

    const filterTypes = ['All', 'Posts', 'People', 'Pages'];

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(filterTypes[newValue]);
        dispatch(setFilterResults({ type: filterTypes[newValue] }));
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="All" />
                <Tab label="Posts" />
                <Tab label="People" />
                <Tab label="Pages" />
            </Tabs>
        </Box>
    );
}

export default SearchFilter;
