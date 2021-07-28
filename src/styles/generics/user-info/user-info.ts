import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useUserInfoStyles = makeStyles({
  root: {
    padding: 15,
    display: "grid"
  },

  userName: {
    padding: 10,
    display: "flex",
    alignItems: "center"
  },

  userDetail: {
    padding: 10,
    display: "grid",
  },

  userDetailEntry: {
    display: "flex", 
    margin: "5px 0px"
  },

  date: {
    padding: "0px 20px",
    display: "grid",
  },

}, {
  name: "user-info"
});