import { useParams } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import { useState, useEffect } from "react";
import { DataSourceEnum } from "@/interfaces/enums/DataSourceEnum";
import { Chart } from "@/components/shared/chart/chart";

export default function StrategyPage() {
  const { id } = useParams();
  const strategyId = id ? parseInt(id) : NaN;
  const [dataSourceType, setDataSourceType] = useState<string>("");

  const { data: strategy, error, isError, isLoading } = getStrategyQuery(strategyId);

  const timeseries = [
    { time: '2024-11-01', value: 25.50 },
    { time: '2024-11-02', value: 27.85 },
    { time: '2024-11-03', value: 28.90 },
    { time: '2024-11-04', value: 30.10 },
    { time: '2024-11-05', value: 29.50 },
    { time: '2024-11-06', value: 32.30 },
    { time: '2024-11-07', value: 33.60 },
    { time: '2024-11-08', value: 34.00 },
    { time: '2024-11-09', value: 35.10 },
    { time: '2024-11-10', value: 36.20 },
  ];
  useEffect(() => {
    if (strategy) {
      if (strategy.data_source_type === DataSourceEnum.FILE) {
        setDataSourceType(DataSourceEnum.FILE);
      } else {
        setDataSourceType(DataSourceEnum.DATABASE);
      }
    }
  }, [strategy]); // This will run when strategy changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      {strategy ? (
        <div>
          <p>{strategy.data_source_type}</p>
          <div>
            <Chart timeseries={timeseries} />
          </div>
        </div>
      ) : (
        <p>Strategy not found.</p>
      )}
    </div>
  );
}
