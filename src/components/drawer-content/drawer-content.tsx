import React from "react";
import { Box, Button, Divider, OutlinedInput } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import UserInfo from "components/user-info/user-info";
import { useDrawerContentStyles } from "styles/drawer-content/drawer-content";
import SearchIcon from '@material-ui/icons/Search';
import strings from "localization/strings";
import { PersonDto, TimebankApi } from "generated/client";

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
  const [ persons, setPersons ] = React.useState<PersonDto[]>([])

  /**
   * Fetches the person data 
   */
  const fetchData = async () => {
    const timeBankApi = new TimebankApi();
    timeBankApi.timebankControllerGetPersons()
    .then(fetchedPersons =>  
{      console.log("persons fetched: ", fetchedPersons);
      setPersons(fetchedPersons);}
    );
  }

  React.useEffect(() => {
    fetchData();    
  }, [])

  /**
   * Renders the drawer content 
   */
  const renderSearchBox = () => {
    return (
      <>
        <Box className={ classes.root }>
          <Box className={ classes.searchBoxContaienr }>
            <SearchIcon className={ classes.searchIcon }/>
            <Autocomplete 
              options={ persons }
              getOptionLabel={ person => person.firstName }
              renderInput={(params) => (
                <OutlinedInput 
                  {...params}  
                  className={ classes.searchBox }
              />
              )}
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