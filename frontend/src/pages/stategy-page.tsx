import { useParams } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import { useState } from "react";
import { DataSourceEnum } from "@/interfaces/enums/DataSourceEnum";
import { Chart } from "@/components/shared/chart/chart";

export default function StrategyPage() {
  const { id } = useParams();
  const strategyId = id ? parseInt(id) : NaN;
  const [dataSourceType, setDataSourceType] = useState("")
  const { data: strategy, error, isError, isLoading } = getStrategyQuery(strategyId)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (strategy?.data_source_type === DataSourceEnum.FILE) {
    setDataSourceType(DataSourceEnum.FILE)
  } else {
    setDataSourceType(DataSourceEnum.DATABASE)
  }

  return (
    <div className="">
      {strategy ? (
        <div>
          <p>{strategy.data_source_type}</p>
          <div>
            <Chart />
          </div>
        </div>
      ) : (
        <p>Strategy not found.</p>
      )}
    </div>
  );
}

