import { Box, useMediaQuery } from '@mui/material';
//import { useSelector } from 'react-redux';
import NavBar from 'scenes/navbar';
import PageSidebarWidget from 'scenes/widgets/PageSidebarWidget';
import PageMembersWidget from 'scenes/widgets/PageMembersWidget';
import { useParams } from 'react-router-dom';
import UserPagePostWidget from 'scenes/widgets/UserPagePostWidget';
import { useSelector } from 'react-redux';
import PagePostContainerWidget from 'scenes/widgets/PagePostContainerWidget';
import PageCalendarWidget from 'scenes/widgets/PageCalendarWidget';

const PagePage = () => {
  //const [page, setPage] = useState(null);
  const { pageId } = useParams();
  const { picturePath } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <NavBar />
      <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}>
        <Box // Left sidebar widget
          height={isNonMobileScreens ? "91vh" : "auto"}
          width="auto"
          padding="0.5rem"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent={isNonMobileScreens ? "flex-start" : "center"}
        >
          <Box flexBasis={isNonMobileScreens ? "15%" : undefined}>
            <PageSidebarWidget pageId={pageId} picturePath={picturePath} />
          </Box>
        </Box>
        <Box // Middle post widget
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          justifyContent="center"
          padding="0.5rem"
          width="100%"
          ml={isNonMobileScreens ? "2rem" : "0"}
        >
          <UserPagePostWidget pageId={pageId} picturePath={picturePath} />
          <PagePostContainerWidget pageId={pageId} />
        </Box>
        <Box // TODO: Add calendar, events, and other widgets in empty space
          width="auto"
          mr={isNonMobileScreens ? "2rem" : "0"}
          ml={isNonMobileScreens ? "2rem" : "0"}
        >
          <PageCalendarWidget pageId={pageId} />
        </Box>
        {isNonMobileScreens && (
          <Box // Right members widget
            padding="0.5rem"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="0.5rem"
            flexBasis={isNonMobileScreens ? "15%" : undefined}
            right={0}
            sx={{ marginLeft: "auto" }}
          >
            <PageMembersWidget pageId={pageId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default PagePage;