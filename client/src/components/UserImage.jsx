import { Box } from "@mui/material";

const serverPort = process.env.REACT_APP_SERVER_PORT;

const UserImage = ({ image, size="60px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%"}} //Circle
                width={size}
                height={size}
                alt="user"
                src={`http://localhost:${serverPort}/assets/${image}`}
            />
        </Box>
    );
};
export default UserImage;