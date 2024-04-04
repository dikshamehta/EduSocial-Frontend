import { Box } from "@mui/material";

const serverPort = process.env.REACT_APP_SERVER_PORT;

const PageImage = ({ image, size="125px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%"}} //Circle
                width={size}
                height={size}
                alt="page"
                src={`http://localhost:${serverPort}/assets/${image}`}
            />
        </Box>
    );
};

export default PageImage;