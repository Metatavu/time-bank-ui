import React from "react";
import { Box, Button, Divider, OutlinedInput, TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import UserInfo from "components/user-info/user-info";
import { useDrawerContentStyles } from "styles/drawer-content/drawer-content";
import SearchIcon from '@material-ui/icons/Search';
import strings from "localization/strings";
import { PersonDto } from "generated/client";
import Api from "api/api";
import { setPerson } from "features/person/person-slice";
import { useAppDispatch } from "app/hooks";

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
  const dispatch = useAppDispatch();

  const classes = useDrawerContentStyles();
  const [ persons, setPersons ] = React.useState<PersonDto[]>([]);
  const [ pendingPerson, setPendingPerson ] = React.useState<PersonDto | null>(null);
  const [ searchInput, setSearchInput ] = React.useState<string>("");
  /**
   * Fetches the person data 
   */
  const fetchData = async () => {
    const timeBankApi = Api.getTimeBankApi();
    timeBankApi.timebankControllerGetPersons()
    .then(fetchedPersons =>  
      {setPersons(fetchedPersons)
      console.log(fetchedPersons)}
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
              freeSolo
              options={ persons }
              getOptionLabel={ person => person.firstName }
              inputValue={ searchInput }
              onChange={ (event, newValue) => {
                if (typeof newValue === 'string'){
                  return;
                }
                setPendingPerson(newValue);
              }}
              onInputChange={ (event, newInputValue) => {
                setSearchInput(newInputValue);
              }}
              renderInput={(params) => (
                <TextField 
                  {...params}  
                  variant="outlined"
              />
              )}
              className={ classes.searchBox }
            />
          </Box>
          <Button 
            onClick={ onSearchButtonClick }
            className={ classes.searchButton }
          >
            { strings.generic.search }
          </Button>
        </Box>
      </>
    );
  }


  /**
   * Event Handler for search button click
   */
  const onSearchButtonClick = () => {
    if (!pendingPerson) {
      return;
    }
    console.log("onSearchButtonClick: ", pendingPerson)

    dispatch(setPerson(pendingPerson));
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