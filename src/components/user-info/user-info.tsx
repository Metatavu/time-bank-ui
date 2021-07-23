import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import { useUserInfoStyles } from "styles/user-info/user-info";

/**
 * User info component
 */
const UserInfo: React.FC = () => {
  const classes = useUserInfoStyles();
  console.log("user info rendered")

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      <Box className={ classes.userName }>
        <Avatar alt="Antti Leppä" >{ "A" }</Avatar>
        <Box style={{ paddingLeft: 10 }}>
          <Typography variant="h2">Antti Leppä</Typography>
          <Typography variant="h6">antti.leppä@metatavu.fi</Typography>
        </Box>
      </Box>
      <Box className={ classes.userDetail}>
        <Box className={ classes.userDetailEntry }>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            { "User type: " }
          </Typography>
          <Typography variant="h5" style={{ paddingLeft: 10, fontStyle: "italic" }}>
            { "ADMIN" }
          </Typography>
        </Box>
        <Box className={ classes.userDetailEntry }>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            { "Language: " }
          </Typography>
          <Typography variant="h5" style={{ paddingLeft: 10, fontStyle: "italic" }}>
            { "ENGLISH_UK" }
          </Typography>
        </Box>
        <Box className={ classes.date}>
          <Box style={{ display: "flex", opacity: 0.6 }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              { "createdAt: " }
            </Typography>
            <Typography variant="h6" style={{ paddingLeft: 10, fontStyle: "italic" }}>
              { "2021-06-11T15:04:43Z" }
            </Typography>
          </Box>
          <Box style={{ display: "flex", opacity: 0.6 }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              { "updatedAt: " }
            </Typography>
            <Typography variant="h6" style={{ paddingLeft: 10, fontStyle: "italic" }}>
              { "2021-07-22T07:23:11Z" }
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserInfo;