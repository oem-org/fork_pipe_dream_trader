import { useParams } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import { useState, useEffect } from "react";
import { DataSourceEnum } from "@/interfaces/enums/DataSourceEnum";
import { Chart } from "@/components/shared/chart/chart";
import { priceData } from "@/components/shared/chart/priceData";
import GenericSelect from "@/components/shared/lists/generic-select";

export default function StrategyPage() {
  const { id } = useParams();
  const strategyId = id ? parseInt(id) : NaN;
  const [dataSourceType, setDataSourceType] = useState<string>("");

  const { data: strategy, error, isError, isLoading } = getStrategyQuery(strategyId);


  useEffect(() => {
    if (strategy) {
      if (strategy.data_source_type === DataSourceEnum.FILE) {
        setDataSourceType(DataSourceEnum.FILE);
      } else {
        setDataSourceType(DataSourceEnum.DATABASE);
      }
    }
  }, [strategy]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      {strategy ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <section className="lg:col-span-1 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">{strategy.name}</h4>
              <p>Data Source Type: {dataSourceType}</p>

            </section>
            <div className="lg:col-span-3 h-[400px] md:h-[600px]">
              <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
                <p className="absolute top-0 left-0 p-2 z-10 bg-white bg-opacity-75 rounded transparent-bg">Chart Title</p>
                <Chart timeseries={priceData} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <section className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Indicators</h4>
              <p>This section contains information about the strategy's indicators.</p>
            </section>
            <section className="lg:col-span-1 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Backtest</h4>
              <p>This section contains backtest results for the strategy.</p>
            </section>
          </div>
        </>
      ) : (
        <p>Strategy not found.</p>
      )}
    </div>
  );
}

