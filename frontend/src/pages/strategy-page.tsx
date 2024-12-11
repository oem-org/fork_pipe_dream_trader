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
import { getTimeseriesApi } from "@/lib/apiClientInstances";


export default function StrategyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paramId = id ? parseInt(id) : NaN;
  const [fileId, setFileId] = useState<number>(0);
  // States
  const [dataSourceType, setDataSourceType] = useState<string>("");
  const [timeperiod, setTimeperiod] = useState<string>("recent");
  const [timeseries, setTimeseries] = useState<Timeseries[]>(priceData)
  const { data: strategy, error, isError, isLoading, refetch } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  //const { data } = getTimeseriesQuery(`file=${fileId}&timeperiod=${timeperiod}`);
  const { data: files } = getFilesQuery();
  useEffect(() => {
    if (strategy) {
      console.log(timeseries)
    }
  }, [strategy, timeperiod]);

  useEffect(() => {
    if (id) {
      console.log("refeching")
      refetch();
    }
  }, [id, refetch]);

  const handleFileChange = async (file: File) => {
    setFileId(file.id)
    console.log(file.id, fileId)
    try {

      const data = await getTimeseriesApi.getQueryString(`file=${file.id}&timeperiod=${timeperiod}`);
      if (!!data) {
        console.log(data)
        console.log(data, "t")


        //setTimeseries(data)
      }
    } catch (error) {

    }
  };


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
              <GenericSelect<File>
                data={files || []}
                keyExtractor={(file) => file.id}
                onSelect={handleFileChange}
                renderItem={(file) => <span>{file.name}</span>}
                title="Select or search"
                searchEnabled={true}
              />

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
                <Chart timeseries={timeseries} />
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
