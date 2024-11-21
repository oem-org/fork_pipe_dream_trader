import { NavLink } from "react-router-dom";
import CoinList from "src/components/coin-list/ListCoins";
import {
  Box,
  Grid,
  GridItem,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import useCoinSearchQueryStore from "src/lib/stores/useCoinSearchQueryStore";
import SearchCoin from "src/components/coin-list/SearchCoin";
// import SortCoinSelector from "src/components/coin-list/SortCoinSelector";
import { useEffect, useState } from "react";

import useCoinQuery from "src/lib/hooks/useCoinQuery";
import { splitPairName } from "src/lib/utils/splitPairName";

export default function CoinListPage() {
  const { data, error, isLoading } = useCoinQuery();

  const { searchCoinQuery } = useCoinSearchQueryStore();

  const [filteredCoins, setFilteredCoins] = useState([]);
  useEffect(() => {
    if (searchCoinQuery.searchText) {
      setFilteredCoins(
        data?.filter((coin) => coin.name.includes(searchCoinQuery.searchText))
      );
    } else {
      setFilteredCoins(data);
    }
  }, [data, searchCoinQuery.searchText]);
  const templateColumns = useBreakpointValue({
    base: "repeat(2, 1fr)",
    md: "repeat(4, 1fr)",
    lg: "repeat(8, 1fr)",
  });

  return (
    <>
      {isLoading && <Spinner />}

      {error && <div>{error.message}</div>}

      <div className="pb-2 mt-5 ml-5 mr-5">
        <SearchCoin />
      </div>

      <Box>
        <Grid templateColumns={templateColumns} gap={5} mt={5} mr={5} ml={5}>
          {filteredCoins?.map((coin) => (
            <GridItem
              key={coin.id}
              colSpan={1}
              bg="blue.500"
              className="hover:bg-gray-300 rounded-lg"
            >
              <NavLink
                className="block text-lg font-semibold text-black hover:text-blue-800 p-2"
                to={`/coins/${coin.name}`}
                replace
              >
                {splitPairName(coin.name)}
              </NavLink>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
