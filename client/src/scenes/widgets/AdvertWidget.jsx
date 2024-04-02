import { Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useNavigate } from 'react-router-dom/dist';

const serverPort = process.env.REACT_APP_SERVER_PORT;
const img_url = `http://localhost:${serverPort}/assets/patek-philippe-banner.png`;

const AdvertWidget = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const navigate = useNavigate();

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Sponsored
                </Typography>
                <Typography 
                    color={medium} 
                    onClick={() => {navigate('/create-ad')}}
                    sx={{ 
                        "&:hover": { 
                            color: main, 
                            cursor: "pointer",
                        },
                    }}
                >
                    Create Ad
                </Typography>
            </FlexBetween>
            <img
                width="100%"
                height="auto"
                alt="advert"
                src={img_url}
                style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <FlexBetween>
                <Typography color={main}>Patek Philippe</Typography>
                <Typography color={medium}>patekphilippe.com</Typography>
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">
                You never actually own a Patek Philippe. 
                You merely look after it for the next generation.
            </Typography>
        </WidgetWrapper>
    );
};

export default AdvertWidget;