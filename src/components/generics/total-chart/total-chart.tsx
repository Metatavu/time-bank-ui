import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import { useTotalChartStyles } from "styles/generics/total-chart/total-chart";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { WorkTimeData, WorkTimeTotalData } from "types";
import theme from "theme/theme";
import { CircularProgress } from "@material-ui/core";

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

  // TODO fix this
  if (!person) {
    return null;
  }

  if (isLoading) {
    return(
      <CircularProgress/ >
    );
  }

  /**
   * Component render
   */
  return (
    <ResponsiveContainer className={ classes.chartContainer }>
      <BarChart
        data={[ displayedData ]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={ 200 } stroke="#000" />
        <Bar dataKey="total" fill={ displayedData.total ? theme.palette.success.main : theme.palette.error.main } />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TotalChart;
