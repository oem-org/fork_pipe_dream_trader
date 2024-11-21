import { NavLink, Outlet } from "react-router-dom"
import CoinList from "../coinList/ListCoins"
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  List,
  ListItem,
  Spinner,
  Text,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react"
import useCoinQuery from "../../hooks/useCoinQuery"
import SearchCoin from "../coinList/SearchCoin"
import SortCoinSelector from "../coinList/SortCoinSelector"
import { useEffect, useState } from "react"
import priceStore from "../../stores/priceStore"
import useCoinSearchQueryStore from "../../stores/coinSearchQueryStore"
import usePriceQuery from "../../hooks/usePriceQuery"
import { splitPairName } from "../../utils/splitPairName"

export default function CryptoCoinList() {
  const { data: dataCoins, error: errorCoins, isLoading: isLoadingCoins } = useCoinQuery()
  const { setCoinId } = priceStore()
  const [isListVisible, setListVisible] = useState(true)
  const borderColor = useColorModeValue('gray.500', 'white');
  const buttonBackgroundColor = useColorModeValue('black', 'white');
  const buttonTextColor = useColorModeValue('white', 'black' );
  const listBgColor = useColorModeValue('gray.100', 'gray.700');
  const listTextColor = useColorModeValue('black', 'white');
  const listBorderColor = useColorModeValue('gray.300', 'gray.500');
  const listItemHoverBgColor = useColorModeValue('gray.300', 'gray.600');
  const { searchCoinQuery } = useCoinSearchQueryStore();

  const [filteredCoins, setFilteredCoins] = useState([]);

  useEffect(() => {
    if (searchCoinQuery.searchText) {
      setFilteredCoins(dataCoins?.filter(coin => coin.name.includes(searchCoinQuery.searchText)));
    } else {
      setFilteredCoins(dataCoins);
    }
  }, [dataCoins, searchCoinQuery.searchText]);




  return (
    <>
      {isLoadingCoins && <Spinner />}
      {errorCoins && <div>{errorCoins.message}</div>}
      <Button
        onClick={() => setListVisible(!isListVisible)}
        width="100%"
        border="none"
        backgroundColor={buttonBackgroundColor}
        color={buttonTextColor}
        _hover={{
          backgroundColor: useColorModeValue('white', 'black' ),
          color: useColorModeValue('black', 'white')
        }}
      >
        {isListVisible ? "Select Pair" : "Select Pair"}
        <Box
          as="span"
          border="solid 1px"
          borderColor="currentColor"
          borderWidth="0 2px 2px 0"
          display="inline-block"
          padding="3px"
          transform={isListVisible ? "rotate(45deg)" : "rotate(-135deg)"}
          marginLeft="5px"
        />
      </Button>
      {isListVisible && (
        <div>
          <div>
            <List
              maxHeight="300px"
              bg={listBgColor}
              className="overflow-auto"
              color={listTextColor}
              borderRadius="md"
              border={`1px solid ${listBorderColor}`}
            >
              {filteredCoins?.map((coin) => (
                <ListItem
                  key={coin.id}
                  py={2}
                  px={3}
                  borderBottom={`1px solid ${listBorderColor}`}
                  _hover={{ backgroundColor: listItemHoverBgColor }}
                >
                  <HStack>
                    <Button
                      whiteSpace="normal"
                      textAlign="left"
                      onClick={() => setCoinId(coin.id)}
                      variant="link"
                      fontSize="md"
                      color={listTextColor}
                    >
                      {splitPairName(coin.name)}
                    </Button>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </div>
          <div className="p-3">
        <SearchCoin />
      </div>
        </div>
        
      )}

    </>
  )
}