import React from "react";
import { selectPerson } from "features/person/person-slice";
import { useAppSelector } from "app/hooks";
import { useTotalChartStyles } from "styles/generics/total-chart/total-chart";
import { WorkTimeData } from "types";

/**
 * Component properties
 */
interface Props {
  displayedData: WorkTimeData[]
  isLoading: boolean
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

  /**
   * Component render
   */
  return (
    <>
    </>
  );
}

export default TotalChart;
