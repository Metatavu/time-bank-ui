import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useUserInfoStyles = makeStyles({

  root: {
    width: "100%"
  },

  userNameStatusContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    padding: `0px ${theme.spacing(2)}px`
  },

  userNameContainer: {
    display: "flex"
  },

  avatar: {
    width: 45,
    height: 45,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary
  }

}, {
  name: "user-info"
});

export default useUserInfoStyles;