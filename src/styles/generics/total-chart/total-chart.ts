import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useTotalChartStyles = makeStyles({

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

}, {
  name: "total-chart"
});

export default useTotalChartStyles;