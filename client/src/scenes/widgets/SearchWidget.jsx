import { Box, useMediaQuery } from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import SearchResults from "../../components/SearchResults";
import Filter from "../../components/SearchFilter";
import NavBar from 'scenes/navbar';
import UserWidget from "./UserWidget";

// const serverPort = process.env.REACT_APP_SERVER_PORT;

const SearchWidget = () => {
    const dispatch = useDispatch();
    // const token = useSelector((state) => state.token);
    // const query = useSelector((state) => state.query);
    const searchResults = useSelector((state) => state.searchResults);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");


    console.log('searchResults : ');
    console.log(searchResults);

    return (
        <Box>
            <NavBar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "15%" : undefined}>
                    <Filter
                        categories={["post", "people", "pages"]}
                        selectedCategories = {["post", "people", "pages"]}
                        onChange = {(event) => {console.log(event)}}
                    />
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "85%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <SearchResults
                        posts={searchResults.posts}
                        people={searchResults.people}
                        pages={searchResults.pages}
                    />
                </Box>
            </Box>
        </Box>
    );
};
export default SearchWidget;