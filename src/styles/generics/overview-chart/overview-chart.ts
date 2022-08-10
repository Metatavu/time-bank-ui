import makeStyles from "@mui/styles/makeStyles";

const useOverviewChartStyles = makeStyles(theme => ({

  horizontalChartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    },
    height: "20vh !important",
    marginTop: `${theme.spacing(2)} !important`
  },

  verticalChartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    },
    height: "30vh !important",
    marginTop: `${theme.spacing(2)} !important`
  },

  customTooltipContainer: {
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.4)"
  }

}), {
  name: "overview-chart"
});

export default useOverviewChartStyles;