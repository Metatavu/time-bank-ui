import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import useOverviewChartStyles from "styles/generics/overview-chart/overview-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";
import { WorkTimeData } from "types";
import theme from "theme/theme";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import TimeUtils from "utils/time-utils";
import strings from "localization/strings";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Component properties
 */
interface Props {
  displayedData: WorkTimeData[];
  isLoading: boolean;
}

/**
 * Overview chart component
 */
const OverviewChart: React.FC<Props> = ({ displayedData, isLoading }) => {
  const classes = useOverviewChartStyles();
  const { person } = useAppSelector(selectPerson);

  // TODO when the user is selected but no selected range
  // Can be added later
  if (!person) {
    return null;
  }

  /**
   * Renders the customized tooltip row
   * 
   * @param name name of the tooltip row
   * @param time time of the tooltip row
   * @param color color of the tooltip row
   */
  const renderCustomizedTooltipRow = (name: string, time: number, color: string) => {
    return (
      <Typography
        variant="h6"
        style={{
          color: color,
          padding: theme.spacing(1)
        }}
      >
        { `${name}: ${TimeUtils.convertToMinutesAndHours(time)}` }
      </Typography>
    );
  };

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
            padding: theme.spacing(1)
          }}
        >
          { selectedData.name }
        </Typography>
        {/* eslint-disable */}
        { selectedData.billableProject !== undefined && renderCustomizedTooltipRow(strings.billableProject, selectedData.billableProject as number, theme.palette.success.main) }
        { selectedData.nonBillableProject !== undefined && renderCustomizedTooltipRow(strings.nonBillableProject, selectedData.nonBillableProject as number, theme.palette.success.main) }
        {/* eslint-enable */}
        { selectedData.internal !== undefined && renderCustomizedTooltipRow(strings.internal, selectedData.internal as number, theme.palette.warning.main) }
        { selectedData.expected !== undefined && renderCustomizedTooltipRow(strings.expected, selectedData.expected as number, theme.palette.info.main) }
      </Box>
    );
  };

  /**
   * Renders the horizontal chart 
   */
  const renderHorizontalChart = () => {
    const preprocessedWorkTimeData = [
      {
        name: strings.logged,
        project: displayedData[0].billableProject,
        internal: displayedData[0].internal
      },
      {
        name: strings.expected,
        expected: displayedData[0].expected
      }
    ];

    return (
      <ResponsiveContainer className={ classes.horizontalChartContainer }>
        <BarChart
          data={ preprocessedWorkTimeData }
          layout="vertical"
          barGap={ 0 }
        >
          <XAxis
            type="number"
            axisLine={ false }
            tickFormatter={ value => TimeUtils.convertToMinutesAndHours(value as number) }
          />
          <YAxis type="category" dataKey="name"/>
          <Tooltip content={ renderCustomizedTooltip }/>
          <Legend wrapperStyle={{ position: "relative" }}/>
          <Bar dataKey="project" name={ strings.billableProject } barSize={ 60 } stackId="a" fill={ theme.palette.success.main }/>
          <Bar dataKey="nonBillableProject" name={ strings.nonBillableProject } barSize={ 60 } stackId="a" fill={ theme.palette.success.light }/>
          <Bar dataKey="internal" name={ strings.internal } barSize={ 60 } stackId="a" fill={ theme.palette.warning.main }/>
          <Bar dataKey="expected" name={ strings.expected } barSize={ 60 } stackId="a" fill={ theme.palette.info.main }/>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  /**
   * Renders the vertical chart 
   */
  const renderVerticalChart = () => {
    return (
      <ResponsiveContainer className={ classes.verticalChartContainer }>
        <BarChart
          data={ displayedData }
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis width={ 100 } tickFormatter={ value => TimeUtils.convertToMinutesAndHours(value as number) }/>
          <Tooltip content={ renderCustomizedTooltip }/>
          <Legend wrapperStyle={{ position: "relative" }}/>
          <Bar dataKey="billableProject" name={ strings.billableProject } stackId="a" fill={ theme.palette.success.main }/>
          <Bar dataKey="nonBillableProject" name={ strings.nonBillableProject } stackId="a" fill={ theme.palette.success.light }/>
          <Bar dataKey="internal" name={ strings.internal } stackId="a" fill={ theme.palette.warning.main }/>
          <Bar dataKey="expected" name={ strings.expected } fill={ theme.palette.info.main }/>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (isLoading) {
    return (
      <CircularProgress/>
    );
  }

  /**
   * Component render
   */
  if (displayedData.length === 1) {
    return renderHorizontalChart();
  }

  return renderVerticalChart();
};

export default OverviewChart;