import { useParams, useNavigate } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState, useEffect } from "react";
import { DataSourceEnum } from "@/interfaces/enums/DataSourceEnum";
import { Chart } from "@/components/shared/chart/chart";
import { priceData } from "@/components/shared/chart/priceData";
import GenericSelect from "@/components/shared/lists/generic-select";
import { Strategy, DatabaseSource, FileSource } from "@/interfaces/Strategy";
import getTimeseriesQuery from "@/lib/queries/getTimeseriesQuery";
import Timeseries from "@/interfaces/Timeseries";

export default function StrategyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paramId = id ? parseInt(id) : NaN;

  // States
  const [dataSourceType, setDataSourceType] = useState<string>("");
  const [timeperiod, setTimeperiod] = useState<string>("");
  const [timeseries, setTimeseries] = useState<Timeseries[]>([])
  const { data: strategy, error, isError, isLoading, refetch } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  //const { data } = getTimeseriesQuery(`file=${fileId}&timeperiod=${timeperiod}`);

  useEffect(() => {
    if (strategy) {
      console.log(strategy, "STRATEGY");
      let data = "ly"
      //setTimeperiod(strategy.timeperiod || "");

      if (strategy.data_source_type === DataSourceEnum.FILE) {
        setDataSourceType(DataSourceEnum.FILE);
        console.log("FILE");

        const fileId = (strategy.data_source as FileSource).id;
        if (!!data) {
          setTimeseries(data)
        }

      } else if (strategy.data_source_type === DataSourceEnum.DATABASE) {

        setDataSourceType(DataSourceEnum.DATABASE);

        const tableName = (strategy.data_source as DatabaseSource).tableName;
        const pair = (strategy.data_source as DatabaseSource).pair;
        //const { data } = getTimeseriesQuery(`pair=${pair}&table=${tableName}timeperiod=${timeperiod}`);

        if (!!data) {
          setTimeseries(data)
        }
      }
    }
    console.log(timeseries)
  }, [strategy, timeperiod]);

  useEffect(() => {
    if (id) {
      console.log("refeching")
      refetch();
    }
  }, [id, refetch]);

  const handleStrategyChange = (strategy: Strategy) => {
    navigate(`/strategy/${strategy.id}`);
  };

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
              <h4 className="text-xl font-bold mb-4">{strategy.data_source_type}</h4>

              <GenericSelect<Strategy>
                data={strategies || []}
                keyExtractor={(s) => s.id}
                onSelect={handleStrategyChange}
                renderItem={(s) => <span>{s.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />
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
