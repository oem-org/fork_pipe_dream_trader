//import StrategyLayout from "../components/shared/layouts/strategy-layout";
//import { darkColors } from "../components/shared/chart/dark-colors";
//import Timeseries from "../interfaces/Timeseries";
//import { initialData } from "../components/shared/chart/initialData";
//import { Chart } from "../components/shared/chart/chart";


//import usePriceStore from "../lib/hooks/usePriceStore";
//import { useEffect, useState } from "react";
//import useStrategyStore from '../lib/hooks/useStrategyStore.ts'
//import usePriceQuery from "../lib/hooks/usePriceQuery.ts";
//import { Price } from "../interfaces/Price.ts";
//import { useQueryClient } from "@tanstack/react-query";

import IndicatorList from "@/components/strategy/indicator-list";

export default function StrategyPage() {

  //let colors = darkColors

  //const { prices, selectedCoinId, results, setResults } = usePriceStore()
  //const { getById, selectedId } = useStrategyStore()
  //const mutateAsync = useDeleteStrategy();
  //const { data: dataPrices, error: errorPrices, isLoading: isLoadingPrices } = usePriceQuery(selectedCoinId)



  //const [chartData, setChartData] = useState<Timeseries[]>(initialData);

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



  return (<>
    <h1>enenenen</h1>
    <IndicatorList />
  </>
    //<StrategyLayout>
    //  <Chart />
    //</StrategyLayout>
  );
}

//<Chart windowSize={windowSize.width} data={chartData} colors={colors} />
//
