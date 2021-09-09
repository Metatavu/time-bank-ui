import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import useUserInfoStyles from "styles/generics/user-info/user-info";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import strings from "localization/strings";
import theme from "theme/theme";
import { PersonDto } from "generated/client";

/**
 * Component properties
 */
interface Props {
  person: PersonDto;
}

/**
 * User info component
 */
const UserInfo: React.FC<Props> = ({ person }) => {
  const classes = useUserInfoStyles();

  if (!person) {
    return null;
  }

  /**
   * Renders the active/inactive status for user
   * 
   * @param status user status
   * @param color color for the status
   */
  const renderUserStatus = (status: string, color: string) => {
    return (
      <Box style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          htmlColor={ color }
          style={{
            width: 6,
            height: 6
          }}
        />
        <Typography
          variant="h6"
          style={{
            color: color,
            marginLeft: 4,
            fontStyle: "italic"
          }}
        >
          { status }
        </Typography>
      </Box>
    );
  };

  /**
   * Renders the username section 
   */
  const renderUsername = () => {
    return (
      <>
        <Avatar
          alt={ `${person.firstName} ${person.lastName}` }
          className={ classes.avatar }
        >
          { person.firstName.charAt(0) }
        </Avatar>
        <Box style={{ paddingLeft: 10 }}>
          <Typography variant="h1">
            { `${person.firstName} ${person.lastName}` }
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "rgba(0,0,0,0.6)" }}
          >
            { person.email }
          </Typography>
        </Box>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      <Box className={ classes.userNameContainer }>
        { renderUsername() }
      </Box>
      { person.active ?
        renderUserStatus(strings.drawerContent.userInfo.active, theme.palette.success.main) :
        renderUserStatus(strings.drawerContent.userInfo.inactive, theme.palette.error.main)
      }
    </Box>
  );
};

export default UserInfo;