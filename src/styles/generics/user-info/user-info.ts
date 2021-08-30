import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useUserInfoStyles = makeStyles({

  root: {
    width: "100%"
  },

  userNameContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    justifyContent: "center"
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