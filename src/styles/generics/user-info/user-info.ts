import makeStyles from "@mui/styles/makeStyles";

const useUserInfoStyles = makeStyles(theme => ({

  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
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

}), {
  name: "user-info"
});

export default useUserInfoStyles;