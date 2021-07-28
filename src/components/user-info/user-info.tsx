import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import { useUserInfoStyles } from "styles/user-info/user-info";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";

/**
 * User info component
 */
const UserInfo: React.FC = () => {

  const classes = useUserInfoStyles();
  const { person } = useAppSelector(selectPerson)

  if(!person) {
    return null;
  }

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      <Box className={ classes.userName }>
        <Avatar alt={ `${person.firstName} ${person.lastName}` }>
          { person.firstName.charAt(0) }
        </Avatar>
        <Box style={{ paddingLeft: 10 }}>
          <Typography variant="h2">
            { `${person.firstName} ${person.lastName}` }
          </Typography>
          <Typography variant="h6">
            { person.email }
          </Typography>
        </Box>
      </Box>
      <Box className={ classes.userDetail}>
        <Box className={ classes.userDetailEntry }>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            { "User type: " }
          </Typography>
          <Typography variant="h5" style={{ paddingLeft: 10, fontStyle: "italic" }}>
            { person.userType }
          </Typography>
        </Box>
        <Box className={ classes.userDetailEntry }>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            { "Language: " }
          </Typography>
          <Typography variant="h5" style={{ paddingLeft: 10, fontStyle: "italic" }}>
            { person.language }
          </Typography>
        </Box>
        <Box className={ classes.date}>
          <Box style={{ display: "flex", opacity: 0.6 }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              { "createdAt: " }
            </Typography>
            <Typography variant="h6" style={{ paddingLeft: 10, fontStyle: "italic" }}>
              { person.createdAt.toLocaleString() }
            </Typography>
          </Box>
          <Box style={{ display: "flex", opacity: 0.6 }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              { "updatedAt: " }
            </Typography>
            <Typography variant="h6" style={{ paddingLeft: 10, fontStyle: "italic" }}>
              { person.updatedAt.toLocaleString() }
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserInfo;