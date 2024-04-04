import { Box } from "@mui/material";

const PageImage = ({ image, size="125px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%"}} //Circle
                width={size}
                height={size}
                alt="page"
                src={`http://localhost:5000/assets/${image}`}
            />
        </Box>
    );
};

export default PageImage;