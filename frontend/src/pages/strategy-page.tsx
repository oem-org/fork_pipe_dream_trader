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
import useStrategyStore from "@/lib/hooks/useStrategyStore";

import IndicatorSection from "@/components/strategy/indicator-section";
import TimeseriesService from "@/lib/services/TimeseriesService";
import Volume from "@/interfaces/Volume";
import { volumeData } from "@/components/shared/chart/volume";
import { priceData2 } from "@/components/shared/chart/priceData2";




export default function StrategyPage() {
  const { id } = useParams();
  const paramId = id ? parseInt(id) : NaN;
  const { setStrategyId } = useStrategyStore();

  // setStrategyId(paramId)

  const navigate = useNavigate();

  const [fileId, setFileId] = useState<number>(0);
  const [dataSourceType, setDataSourceType] = useState<string>("");
  const [timeperiod, setTimeperiod] = useState<string>("recent");
  const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
  const [volume, setVolume] = useState<Volume[]>([]);
  //const [selectedIndicator, setSelectedIndicator] = useState<number>(0)

  const { data: strategy, error, isError, isLoading, refetch } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  const { data: files } = getFilesQuery();



  useEffect(() => {
    setStrategyId(paramId)

  }, [])


  useEffect(() => {
    if (strategy) {
      //siRefetch();
    }
  }, []);


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

  const test = () => {
    setTimeseries(priceData2)
  }
  //TODO:
  const handleFileChange = async (file: File) => {
    setFileId(file.id);
    try {
      const data = await getTimeseriesApi.getQueryString(`file=${file.id}&timeperiod=${timeperiod}`);
      if (!!data) {
        const json = JSON.parse(data)
        const timeseriesService = new TimeseriesService()
        timeseriesService.processOHLC(json)
        const ohlc = timeseriesService.ohlc
        setTimeseries(ohlc)
        const volume = timeseriesService.volume
        setVolume(volume)
        console.log("volume", ohlc);
        console.log("ohlc", volume);
      }
    } catch (error) {
      console.error(error);
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
              <button onClick={() => test()}>test</button>
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
                <Chart volume={volume} timeseries={timeseries} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <section className="lg:col-span-3 p-4 bg-gray-100 rounded-lg">
              <IndicatorSection />
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
