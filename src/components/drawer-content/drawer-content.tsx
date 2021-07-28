import React from "react";
import { Box, Button, Divider, TextField, Typography } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import UserInfo from "components/generics/user-info/user-info";
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
      setPersons(fetchedPersons)
    );
  }

  React.useEffect(() => {
    fetchData();    
  }, [])

  /**
   * Renders the autocomplete options 
   * 
   * @param person person option to be rendered
   */
  const renderOptions = (person: PersonDto) => {
    return (
      <Box p={ 0.5 }>
        <Typography variant="h5">
          { `${person.firstName} ${person.lastName}` }
        </Typography>
        <Typography variant="h6" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
          { person.email }
        </Typography>
      </Box>
    );
  }

  /**
   * Renders the search box
   */
  const renderSearchBox = () => {
    return (
      <>
        <Box className={ classes.searchBoxContaienr }>
          <SearchIcon className={ classes.searchIcon }/>
          <Autocomplete 
            freeSolo
            options={ persons }
            inputValue={ searchInput }
            getOptionLabel={ person => `${person.firstName} ${person.lastName}` }
            renderOption={ person => (
              renderOptions(person)
            ) }
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

    dispatch(setPerson(pendingPerson));
  }

  /**
   * Component render
   */
  return (
    <>
      <Box className={ classes.drawerContentContainer }>
        { renderSearchBox() }
      </Box>
      <Divider />
      <Box className={ classes.drawerContentContainer }>
        <UserInfo />
      </Box>
    </>
  );


}

export default DrawerContent;