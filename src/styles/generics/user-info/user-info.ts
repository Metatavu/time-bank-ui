import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useUserInfoStyles = makeStyles({
  root: {
    display: "grid",
    width: "100%"
  },

  userNameContainer: {
    padding: 10,
    display: "flex",
    alignItems: "center"
  },

  userDetail: {
    padding: 10,
    display: "grid",
  },

  avatar: {
    width: 45,
    height: 45,
    backgroundColor: theme.palette.secondary.main
  },

  userDetailEntry: {
    display: "flex", 
    margin: "5px 0px"
  },

  userDetailDateEntry: {
    display: "flex", 
    opacity: 0.6 
  },

  date: {
    padding: "0px 20px",
    display: "grid",
  },

  infoValue: {
    paddingLeft: theme.spacing(1), 
    fontStyle: "italic"
  }

}, {
  name: "user-info"
});