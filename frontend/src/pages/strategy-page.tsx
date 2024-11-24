import StrategyLayout from "../components/shared/layouts/strategy-layout";
import Chart from "../components/shared/chart/chart";
import { darkColors } from "../components/shared/chart/dark-colors";
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

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  //console.log(prices)
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
  ]
  const [chartData, setChartData] = useState(initialData);

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
      <Chart windowSize={windowSize.width} data={chartData} colors={colors} />
    </StrategyLayout>
  );
}

