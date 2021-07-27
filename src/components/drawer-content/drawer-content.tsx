import React from "react";
import { Box, Button, Divider, OutlinedInput } from "@material-ui/core";
import UserInfo from "components/user-info/user-info";
import { useDrawerContentStyles } from "styles/drawer-content/drawer-content";
import SearchIcon from '@material-ui/icons/Search';
import strings from "localization/strings";

/**
 * Component properties
 */
interface Props {
}

/**
 * Application drawer content component
 *
 * @param props component properties
 */
const DrawerContent: React.FC<Props> = () => {
  const classes = useDrawerContentStyles();


  /**
   * Renders the drawer content 
   */
  const renderSearchBox = () => {
    return (
      <>
        <Box className={ classes.root }>
          <Box className={ classes.searchBoxContaienr }>
            <SearchIcon className={ classes.searchIcon }/>
            <OutlinedInput 
              className={ classes.searchBox }
            />
          </Box>
          <Button className={ classes.saerchButton }>
            { strings.generic.search }
          </Button>
        </Box>
      </>
    );
  }

  /**
   * Component render
   */
  return (
    <>
      { renderSearchBox() }
      <UserInfo />
    </>
  );
}

export default DrawerContent;