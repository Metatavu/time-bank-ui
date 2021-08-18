import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import { useOverviewChartStyles } from "styles/generics/overview-chart/overview-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { WorkTimeCategory, WorkTimeData } from "types";
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

  // TODO fix this
  if (!person) {
    return null;
  }


  /**
   * Renders the horizontal chart 
   */
  const renderHorizontalChart = () => {
    const preprocessedWorkTimeData = [
      {
        name: WorkTimeCategory.LOGGED,
        project: displayedData[0].project,
        internal: displayedData[0].internal 
      },
      {
        name: WorkTimeCategory.EXPECTED,
        expected: displayedData[0].expected
      }
    ]

    return (
      <ResponsiveContainer className={ classes.chartContainer }>
        <BarChart
          data={ preprocessedWorkTimeData }
          layout="vertical" 
          margin={{
            top: 20,
            right: 40,
            left: 60,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="name"/>
          <Tooltip content={ renderCustomizedTooltip }/>
          <Legend />
          <Bar dataKey="project" barSize={ 60 } stackId="a" fill={ theme.palette.success.main } />
          <Bar dataKey="internal" barSize={ 60 } stackId="a" fill={ theme.palette.warning.main } />
          <Bar dataKey="expected" barSize={ 60 } stackId="a" fill={ theme.palette.info.main } />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /**
   * Renders the vertical chart 
   */
  const renderVerticalChart = () => {
    return (
      <ResponsiveContainer className={ classes.chartContainer }>
        <BarChart
          data={ displayedData }
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={ 100 } tickFormatter={ value => TimeUtils.minuteToHourString(value as number) }/>
          <Tooltip content={ renderCustomizedTooltip }/>
          <Legend wrapperStyle={{ position: 'relative' }}/>
          <Bar dataKey="project" stackId="a" fill={ theme.palette.success.main } />
          <Bar dataKey="internal" stackId="a" fill={ theme.palette.warning.main } />
          <Bar dataKey="expected" fill={ theme.palette.info.main } />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /**
   * Renders the customized tooltip for charts
   */
  const renderCustomizedTooltip = (props: any) => {
    // TODO fix any
    const { active, payload } = props;


    if (!active || !payload || !payload.length || !payload[0].payload) {
      return null;
    }

    console.log(props)

    const selectedData = payload[0].payload;

    return (
      <Box className={ classes.customTooltipContainer }>
        { (selectedData.project !== undefined) && renderCustomizedTooltipRow(strings.project, selectedData.project as number, theme.palette.success.main) }
        { (selectedData.internal !== undefined) && renderCustomizedTooltipRow(strings.internal, selectedData.internal as number, theme.palette.warning.main) }
        { (selectedData.expected !== undefined) && renderCustomizedTooltipRow(strings.expected, selectedData.expected as number, theme.palette.info.main) }
      </Box>
    )
  };

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
      { `${name}: ${TimeUtils.minuteToHourString(time)}` }
    </Typography>
    );
  };

  if (isLoading) {
    return(
      <CircularProgress/ >
    );
  }

  /**
   * Component render
   */
  if (displayedData.length === 1) {
    return renderHorizontalChart();
  }

  return renderVerticalChart();
}

export default OverviewChart;
