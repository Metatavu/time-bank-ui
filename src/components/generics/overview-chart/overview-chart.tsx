import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import { useOverviewChartStyles } from "styles/generics/overview-chart/overview-chart";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WorkTimeData } from "types";
import theme from "theme/theme";
import { CircularProgress } from "@material-ui/core";

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
    return (
      <ResponsiveContainer className={ classes.chartContainer }>
        <BarChart
          data={ displayedData }
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="project" stackId="a" fill={ theme.palette.success.main } />
          <Bar dataKey="internal" stackId="a" fill={ theme.palette.warning.main } />
          <Bar dataKey="expected" fill={ theme.palette.info.main } />
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
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="project" stackId="a" fill={ theme.palette.success.main } />
          <Bar dataKey="internal" stackId="a" fill={ theme.palette.warning.main } />
          <Bar dataKey="expected" fill={ theme.palette.info.main } />
        </BarChart>
      </ResponsiveContainer>
    );
  }

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
