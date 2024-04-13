import { Box } from "@mui/material";

const serverURL = process.env.REACT_APP_SERVER_URL;

const PageImage = ({ image, size="125px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%"}} //Circle
                width={size}
                height={size}
                alt="page"
                src={`${serverURL}/assets/${image}`}
            />
        </Box>
    );
};

export default PageImage;