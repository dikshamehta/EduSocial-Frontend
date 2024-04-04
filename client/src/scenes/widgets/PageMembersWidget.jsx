import React from "react";
import { Typography, Divider, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import Member from "components/Member";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

const PageMembersWidget = ({ pageId }) => {
    const [members, setMembers] = useState([]);
    const { palette } = useTheme();

    const getMembers = async () => {
        const response = await fetch(`http://localhost:5000/page/${pageId}/members`, {
            method: "GET",
            //headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMembers(data);
    }

    useEffect(() => {
        getMembers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <WidgetWrapper width="100%">
        <Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1rem" }}
        >
          Members
        </Typography>
        <Divider sx={{ mb: "1rem" }} />
        <Box
          height="79vh"
          display="flex"
          flexDirection="column"
          gap="1.5rem"
          maxHeight="92vh"
          sx={{ overflowY: "auto" }}
        >
          {members.map((member) => (
            <Member
              key={member._id}
              memberId={member._id}
              name={`${member.firstName} ${member.lastName}`}
              userPicturePath={member.picturePath}
            />
          ))}
        </Box>
      </WidgetWrapper>
    );
};

export default PageMembersWidget;