import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useOverviewChartStyles = makeStyles({

  horizontalChartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    },
    height: "20vh !important",
    marginTop: `${theme.spacing(2)}px !important`
  },

  verticalChartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay"
    },
    height: "30vh !important",
    marginTop: `${theme.spacing(2)}px !important`
  },

  customTooltipContainer: {
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.4)"
  }

}, {
  name: "overview-chart"
});

export default useOverviewChartStyles;