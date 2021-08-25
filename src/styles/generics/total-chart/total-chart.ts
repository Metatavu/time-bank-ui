import { makeStyles } from "@material-ui/core";

const useTotalChartStyles = makeStyles(theme => ({

  root: {
    width: "100%",
    maxHeight: 200,
    padding: theme.spacing(3)
  },

  chartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    }
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