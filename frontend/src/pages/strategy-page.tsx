import StrategyLayout from "../components/shared/layouts/strategy-layout";
import { App } from "../components/shared/test";
import Chart from "../components/shared/chart/chart";
import ChartComponent from "../components/shared/chart/chart";
import { darkColors } from "../components/shared/chart/dark-colors";
import Timeseries from "../interfaces/Timeseries";
import { initialData } from "../components/shared/chart/initialData";
//import usePriceStore from "../lib/hooks/usePriceStore";
import { useEffect, useState } from "react";
//import useStrategyStore from '../lib/hooks/useStrategyStore.ts'
//import usePriceQuery from "../lib/hooks/usePriceQuery.ts";
//import { Price } from "../interfaces/Price.ts";
//import { useQueryClient } from "@tanstack/react-query";

export default function StrategyPage() {

  let colors = darkColors

  //const { prices, selectedCoinId, results, setResults } = usePriceStore()
  //const { getById, selectedId } = useStrategyStore()
  //const mutateAsync = useDeleteStrategy();
  //const { data: dataPrices, error: errorPrices, isLoading: isLoadingPrices } = usePriceQuery(selectedCoinId)



  const [chartData, setChartData] = useState<Timeseries[]>(initialData);

  //function formatPriceData(rawData: Price[] | null) {
  //  return rawData.map(item => ({
  //    time: new Date(item.time).getTime() / 1000, // convert to Unix t  imestamp
  //    value: parseFloat(item.price) // convert price to a number
  //  }));
  //}

  //const queryClient = useQueryClient();

  //useEffect(() => {
  //let ldd = getById(selectedId)
  //queryClient.invalidateQueries({ queryKey: ['coins', selectedCoinId, 'prices'] });
  //if (dataPrices) {
  //setNext(dataPrices.next)
  //setPrevious(dataPrices.previous)
  //setResults(dataPrices.results)
  //if (results !== null) {
  // Call dataprices directly as async madness
  //const formatedData = formatPriceData(dataPrices.results)
  //setChartData(formatedData)

  //    }
  //
  //
  //  }
  //}, [selectedCoinId, dataPrices])



  return (
    <StrategyLayout>
      <App />
    </StrategyLayout>
  );
}

//<Chart windowSize={windowSize.width} data={chartData} colors={colors} />
