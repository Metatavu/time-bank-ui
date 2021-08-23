import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import useTotalChartStyles from "styles/generics/total-chart/total-chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, TooltipProps } from "recharts";
import { WorkTimeTotalData } from "types";
import theme from "theme/theme";
import { CircularProgress, Box, Typography } from "@material-ui/core";
import TimeUtils from "utils/time-utils";
import strings from "localization/strings";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Component properties
 */
interface Props {
  displayedData: WorkTimeTotalData;
  isLoading: boolean;
}

/**
 * Total chart component
 */
const TotalChart: React.FC<Props> = ({ displayedData, isLoading }) => {
  const classes = useTotalChartStyles();
  const { person } = useAppSelector(selectPerson);

  // TODO when the user is selected but no selected range
  // Can be added later
  if (!person) {
    return null;
  }

  if (isLoading) {
    return (
      <CircularProgress/>
    );
  }

  /**
   * Renders the customized tooltip for charts
   * 
   * @param props props of the custom tooltip
   */
  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (!active || !payload || !payload.length || !payload[0].payload) {
      return null;
    }

    const selectedData = payload[0].payload;

    return (
      <Box className={ classes.customTooltipContainer }>
        <Typography
          variant="h6"
          style={{
            color: displayedData.total > 0 ? theme.palette.success.main : theme.palette.error.main,
            padding: theme.spacing(1)
          }}
        >
          { `${strings.total}: ${TimeUtils.convertToMinutesAndHours(selectedData.total)}` }
        </Typography>
      </Box>
    );
  };

  // TODO domain might be change once the internal time is fixed
  const range = Math.max(5 * 24 * 60, Math.abs(displayedData.total));

  /**
   * Component render
   */
  return (
    <ResponsiveContainer className={ classes.chartContainer }>
      <BarChart
        layout="vertical"
        data={[ displayedData ]}
      >
        <XAxis
          type="number"
          axisLine={ false }
          domain={ [-range, range] }
          tickCount={ 10 }
          tickFormatter={ value => TimeUtils.convertToMinutesAndHours(value as number) }
        />
        <YAxis
          hide
          type="category"
          dataKey="name"
        />
        <Tooltip content={ renderCustomizedTooltip }/>
        <Legend/>
        <Bar
          dataKey="total"
          barSize={ 50 }
          fill={ displayedData.total > 0 ? theme.palette.success.main : theme.palette.error.main }
        />
        <ReferenceLine x={ 0 } stroke="rgba(0, 0, 0, 0.5)"/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TotalChart;