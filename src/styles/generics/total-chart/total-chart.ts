import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useTotalChartStyles = makeStyles({

  chartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay",
    }
  }

}, {
  name: "total-chart"
});
