import { useParams, useNavigate } from "react-router-dom";
import getStrategyQuery from "@/lib/queries/getStrategyQuery";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import { useState, useEffect } from "react";
import { Chart } from "@/components/shared/chart/chart";
import { Strategy, DatabaseSource, FileSource } from "@/interfaces/Strategy";
import File from "@/interfaces/File";
import GenericSelect from "@/components/shared/lists/generic-select";
import Timeseries from "@/interfaces/Timeseries";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import { getTimeseriesApi, putStrategyApi } from "@/lib/apiClientInstances";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import IndicatorSection from "@/components/strategy/indicator-section";
import TimeseriesService from "@/lib/services/TimeseriesService";
import { Volume } from "@/interfaces/Volume";
import { priceData2 } from "@/components/shared/chart/priceData2";
import { Button } from "@/components/shared/buttons/button";
import { GenericIndicator } from "@/interfaces/GenericIndicator";

export default function StrategyPage() {
  const { id } = useParams();
  const paramId = id ? parseInt(id) : NaN;
  const { strategyId, setStrategyId } = useStrategyStore();
  const navigate = useNavigate();

  const [isRow, setIsRow] = useState(true);



  const [fileId, setFileId] = useState<number>(0);
  const [dataSourceType, setDataSourceType] = useState<string>("");
  const [timeperiod, setTimeperiod] = useState<string>("recent");
  const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
  const [volume, setVolume] = useState<Volume[]>([]);
  const [histograms, setHistograms] = useState<any>([]);
  const [lineSeries, setLineSeries] = useState<GenericIndicator[]>([]);
  const [isChartLoaded, setIsChartLoaded] = useState(false); // New state to control chart loading

  const { data: strategy, error, isError, isLoading, refetch } = getStrategyQuery(paramId);
  const { data: strategies } = getStrategiesQuery();
  const { data: files } = getFilesQuery();

  function parseJsonStrings(obj: Record<string, any>) {
    for (const key in obj) {
      try {
        const parsedValue = JSON.parse(obj[key]);

        // Replace the string value with the parsed JSON object
        obj[key] = parsedValue;
      } catch (error) {
        // Log a warning if the string is not valid JSON
        console.warn(`Key "${key}" contains invalid JSON:`, obj[key]);
      }
    }
    return obj; // Return the updated object
  }

  // TODO:
  async function LoadChart() {
    try {
      if (strategyId) {
        const data = await getTimeseriesApi.getQueryString(`timeperiod=${timeperiod}&strategy=${strategyId}`);
        const parsed = parseJsonStrings(data)
        console.log(parsed, "parsed");

        const timeseriesService = new TimeseriesService();
        console.log("aggggggg")
        await timeseriesService.processOhlc(parsed.ohlc);
        await timeseriesService.processVolume(parsed.volume);
        const columns = parsed.columns
        const chartStyle = parsed.chart_style


        delete parsed.ohlc;
        delete parsed.volume;
        delete parsed.chart_style;
        delete parsed.columns;

        await timeseriesService.processBulk(parsed)
        console.log("ntttttttttttttttttttttttttttttt");

        //const chartService = new ChartService(timeseriesService.indicators, chartStyle)
        timeseriesService.updateChart(chartStyle, columns)

        console.log(timeseriesService.ohlc, "chart")
        setTimeseries(timeseriesService.ohlc)
        setVolume(timeseriesService.volume)
        setIsChartLoaded(true); // Mark chart as loaded
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (strategyId) {
      LoadChart();
    }
  }, [strategyId]); // Dependency on strategyId

  useEffect(() => {
    setStrategyId(paramId);
  }, [paramId, setStrategyId]);

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
    setTimeseries(priceData2);
  };

  const handleFileChange = async (file: File) => {
    setFileId(file.id);
    await LoadChart();

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
              <Button onClick={() => setIsRow(!isRow)}>Toggle </Button>
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
            <div className="lg:col-span-3">
              {isChartLoaded ? (
                <div
                  className={`flex ${isRow ? 'flex-row' : 'flex-col'
                    }`}
                >
                  <div className="relative w-full h-[400px] md:h-[600px] bg-white rounded-lg overflow-hidden">
                    <p className="absolute top-0 left-0 p-2 z-10 bg-white bg-opacity-75 rounded transparent-bg">
                      Chart Title
                    </p>
                    <Chart volume={volume} timeseries={timeseries} />
                  </div>
                </div>) : (
                <p>Loading chart...</p>
              )}
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
