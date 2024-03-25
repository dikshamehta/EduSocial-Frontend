import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexBetween = styled(Box)({ //Good for reusing CSS as a component
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
});

export default FlexBetween;