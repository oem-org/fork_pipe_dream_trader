import {
  useQuery, useQueryClient
import { PricesClient } from "../ser";
import { PriceResponse } from "../models/PriceResponse";
import priceStore from "../stores/priceStore";
import { useState } from "react";

const usePriceQuery = (coinId: number, paginate: boolean = false, page: number = 1) => {
  // const { page } = priceStore();



  const fetchPrices = async (page?: number): Promise<PriceResponse> => {
    console.log("COINID", coinId);

    const options = paginate ? { page } : undefined;
    const priceData: PriceResponse = await pricesClient.get(coinId, options);
    return priceData;
  };

  const queryKey = paginate ? ["coin", coinId, "prices", page] : ["coin", coinId, "prices"]

  return {
    ...useQuery<PriceResponse, Error>({
      queryKey,
      queryFn: () => fetchPrices(page),
      //placeholderData: keepPreviousData,// Retains the previous data while fetching the new page
    }),
  };
};

export default usePriceQuery;
