import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { splitPairName } from "../utils/splitPairName";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Button, Heading, Text, VStack, HStack, Flex, Center } from "@chakra-ui/react";
import Coin from "../models/Coin";
import usePriceQuery from "../hooks/usePriceQuery";
import useCoinQuery from "../hooks/useCoinQuery";

export default function Coinpage() {
  const queryClient = useQueryClient();
  const { data: coinsData } = useCoinQuery();
  let coins = queryClient.getQueryData<Coin[]>(["coins"]) || coinsData;

  const params = useParams<{ id: string }>();
  const coin = coins?.find((coin) => coin.name === params.id);
  const [currentPage, setCurrentPage] = useState(1);
  // Ensure usePriceQuery is always called regardless of coin being found

  const { data, isError, isLoading } = usePriceQuery(coin?.id, true, currentPage);

  if (!coin) {
    return <div>Coin not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading prices</div>;
  }

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  // useEffect(() => {
  //   // React Query handles refetching internally
  // }, [currentPage]);

  return (
    <Center>
      <Box p={5} maxWidth="800px">
        <Heading as="h1" size="lg" mb={2}>
          Coin {splitPairName(params.id)}
        </Heading>
        <VStack align="stretch">
          {data?.results.map((price, index) => (
            <Flex key={index}>
              <Flex shadow="md" borderWidth="1px" p={1}>
              <Text fontWeight="bold">Price:</Text><Text>{price.price}$</Text>
              </Flex>
              <Flex shadow="md" borderWidth="1px" p={1}>
              <Text fontWeight="bold">Datetime:</Text><Text/><Text>{price.time}</Text>
              </Flex>
            </Flex>
          ))}
        </VStack>
        <HStack spacing={4} mt={5}>
          <Button onClick={handlePreviousPage} disabled={!data?.previous}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={!data?.next}>
            Next
          </Button>
        </HStack>
      </Box>
    </Center>
  );
}