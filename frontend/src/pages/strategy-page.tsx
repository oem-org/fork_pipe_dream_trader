import { useParams, useNavigate } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState, useEffect } from "react";
import { Chart } from "@/components/shared/chart/chart";
import { priceData } from "@/components/shared/chart/priceData";
import GenericSelect from "@/components/shared/lists/generic-select";
import { Strategy, DatabaseSource, FileSource } from "@/interfaces/Strategy";
import File from "@/interfaces/File";
import Timeseries from "@/interfaces/Timeseries";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import { getTimeseriesApi, postStrategyIndicatorsApi } from "@/lib/apiClientInstances";
import getIndicatorsQuery from "@/lib/queries/getIndicatorsQuery";
import Indicator from "@/interfaces/Indicator";
import useStrategyIndicatorStore from "@/lib/hooks/useStrategyIndicatorsStore";




export default function StrategyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paramId = id ? parseInt(id) : NaN;
  const [fileId, setFileId] = useState<number>(0);
  const [dataSourceType, setDataSourceType] = useState<string>("");
  const [timeperiod, setTimeperiod] = useState<string>("recent");
  const [timeseries, setTimeseries] = useState<Timeseries[]>(priceData);
  const { data: strategy, error, isError, isLoading, refetch } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  const { data: indicators } = getIndicatorsQuery();
  const { data: files } = getFilesQuery();
  const { addStrategyIndicator, deleteStrategyIndicator, putStrategyIndicator } = useStrategyIndicatorStore();


  useEffect(() => {
    if (strategy) {
      console.log(timeseries);
    }
  }, [strategy, timeperiod]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
    try {
      const data = await getTimeseriesApi.getQueryString(`file=${file.id}&timeperiod=${timeperiod}`);
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStrategyChange = (strategy: Strategy) => {
    navigate(`/strategy/${strategy.id}`);
  };
  let settings = { "kind": "rsi", "length": 10 }

  const handleIndicatorChange = (indicator: Indicator) => {
    if (strategy) {
      addStrategyIndicator(strategy.id, indicator.id, settings)
    }
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
              <GenericSelect<File>
                data={files || []}
                keyExtractor={(file) => file.id}
                nameExtractor={(file) => file.name}
                onSelect={handleFileChange}
                renderItem={(file) => <span>{file.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />
              <GenericSelect<Strategy>
                data={strategies || []}
                keyExtractor={(strategy) => strategy.id}
                nameExtractor={(strategy) => strategy.name}
                onSelect={handleStrategyChange}
                renderItem={(strategy) => <span>{strategy.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />
            </section>
            <div className="lg:col-span-3 h-[400px] md:h-[600px]">
              <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
                <p className="absolute top-0 left-0 p-2 z-10 bg-white bg-opacity-75 rounded transparent-bg">
                  Chart Title
                </p>
                <Chart timeseries={timeseries} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <section className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Indicators</h4>
              <GenericSelect<Indicator>
                data={indicators || []}
                keyExtractor={(indicator) => indicator.id}
                nameExtractor={(indicator) => indicator.kind}
                onSelect={handleIndicatorChange}
                renderItem={(indicator) => <span>{indicator.kind}</span>}
                title="Select or search"
                searchEnabled={true}
              />
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
