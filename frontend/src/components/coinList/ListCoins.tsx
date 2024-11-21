import { Box, Grid, List, ListItem, Spinner, Text } from "@chakra-ui/react"
import useCoinQuery from "../../hooks/useCoinQuery"

function CoinList() {

const { data, error, isLoading } = useCoinQuery()
return (
          <>
          {isLoading && <Spinner />}
          {error && <div>{error.message}</div>}
            <List>

            {data?.map((coin) => (
                <ListItem key={coin.id}>
                {coin.name}
                </ListItem>
            ))}
            </List>
          </>
)
}

export default CoinList


