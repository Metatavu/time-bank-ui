import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import useTotalChartStyles from "styles/generics/total-chart/total-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, TooltipProps } from 'recharts';
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
    return(
      <CircularProgress/ >
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
          { `${strings.total}: ${TimeUtils.minuteToHourString(selectedData.total)}` }
        </Typography>
      </Box>
    )
  };

  // TODO domain might be change once the internal time is fixed
  const range = Math.max(20000, Math.abs(displayedData.total));

  /**
   * Component render
   */
  return (
    <ResponsiveContainer className={ classes.chartContainer }>
      <BarChart
        layout="vertical" 
        data={[ displayedData ]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          domain={ [-range, range] } 
          tickFormatter={ value => TimeUtils.minuteToHourString(value as number) }
        />
        <YAxis 
          hide
          type="category" 
          dataKey="name" 
        />
        <Tooltip content={ renderCustomizedTooltip }/>
        <Legend />
        <Bar 
          dataKey="total" 
          barSize={ 60 } 
          fill={ displayedData.total > 0 ? theme.palette.success.main : theme.palette.error.main } 
        />
        <ReferenceLine x={ 0 } stroke="rgba(0, 0, 0, 0.5)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TotalChart;
