import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useOverviewChartStyles = makeStyles({

  chartContainer: {
    "& .recharts-wrapper .recharts-surface": {
      overflow: "overlay",
    }
  }

}, {
  name: "overview-chart"
});
