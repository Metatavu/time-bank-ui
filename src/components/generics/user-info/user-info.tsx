import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import { useUserInfoStyles } from "styles/generics/user-info/user-info";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import strings from "localization/strings";
import { isNamespaceExport } from "typescript";

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
   * Renders the username section 
   */
  const renderUsername = () => {
    return (
      <>
        <Avatar alt={ `${person.firstName} ${person.lastName}` } className={ classes.avatar } >
          { person.firstName.charAt(0) }
        </Avatar>
        <Box style={{ paddingLeft: 10 }}>
          <Typography variant="h2">
            { `${person.firstName} ${person.lastName}` }
          </Typography>
          <Typography variant="h6" style={{ color: "rgba(0,0,0,0.6)" }} >
            { person.email }
          </Typography>
        </Box>
      </>
    );
  }

  /**
   * Renders the username section 
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   * @param variant variant of the subtitle text
   */
  const renderUserDetailEntry = (name: string, value: string, variant: "h5" | "h6") => {
    return (
      <>
        <Typography 
          variant={ variant } 
          style={{ fontWeight: 600 }}
        >
          { name }
        </Typography>
        <Typography 
          variant={ variant }
          className={ classes.infoValue }
        >
          { value }
        </Typography>
      </>
    );
  }

    /**
   * Renders the user detail section 
   */
  const renderUserDetail = () => {
    return (
      <>
        <Box className={ classes.userDetailEntry }>
          { renderUserDetailEntry(strings.drawerContent.userInfo.userType, person.userType, "h5") }
        </Box>
        <Box className={ classes.userDetailEntry }>
          { renderUserDetailEntry(strings.drawerContent.userInfo.language, person.language, "h5") }
        </Box>
        <Box className={ classes.date}>
          <Box className={ classes.userDetailDateEntry }>
            { renderUserDetailEntry(strings.drawerContent.userInfo.createdAt, person.createdAt.toLocaleString(), "h6") }
          </Box>
          <Box className={ classes.userDetailDateEntry }>
            { renderUserDetailEntry(strings.drawerContent.userInfo.updatedAt, person.updatedAt.toLocaleString(), "h6") }
          </Box>
        </Box>
      </>
    );
  }

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      <Box className={ classes.userNameContainer }>
        { renderUsername() }
      </Box>
      <Box className={ classes.userDetail}>
        { renderUserDetail() }
      </Box>
    </Box>
  );
}

export default UserInfo;