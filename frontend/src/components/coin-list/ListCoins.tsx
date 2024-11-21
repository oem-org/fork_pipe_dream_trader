import { List, ListItem, Spinner } from "@chakra-ui/react";
import useCoinQuery from "../src/lib/hooks/useCoinQuery";

function CoinList() {
  const { data, error, isLoading } = useCoinQuery();
  return (
    <>
      {isLoading && <Spinner />}
      {error && <div>{error.message}</div>}
      <List>
        {data?.map((coin) => (
          <ListItem key={coin.id}>{coin.name}</ListItem>
        ))}
      </List>
    </>
  );
}

export default CoinList;
