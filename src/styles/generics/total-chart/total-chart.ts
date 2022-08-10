import makeStyles from "@mui/styles/makeStyles";

const useTotalChartStyles = makeStyles(theme => ({

  root: {
    width: "100%",
    maxHeight: 200,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },

  chartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    },
    marginTop: `${theme.spacing(2)} !important`
  },

  customTooltipContainer: {
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.4)"
  }

}), {
  name: "total-chart"
});

export default useTotalChartStyles;