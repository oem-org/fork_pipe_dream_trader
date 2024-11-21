import { useEffect} from 'react'
import { Box, Button, Grid, GridItem as ChakraGridItem } from '@chakra-ui/react'

import useGridQuery from '../../hooks/useGridQuery'

import useGridStore from './store.ts'



const GridDashboard = () => {
const { gridItems, add, remove, setGridItems } = useGridStore()
const { data: gridItemsLoad, isLoading, error } = useGridQuery()
//isLoading, error from the React Query

  useEffect(() => {
    if (gridItemsLoad) {
      // LOAD THEM HERE
      // setGridItems(gridItemsLoad)
    }
  }, [gridItemsLoad, setGridItems])

  return (
    <Box>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <Button onClick={() => add('small')}>Add Small Item</Button>
      <Button onClick={() => add('medium')}>Add Medium Item</Button>
      <Button onClick={() => add('large')}>Add Large Item</Button>

      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {gridItems.map((item) => (
          <ChakraGridItem
            key={item.id}
            colSpan={item.size === 'small' ? 2 : item.size === 'medium' ? 4 : 8}
            rowSpan={item.size === 'small' ? 2 : item.size === 'medium' ? 4 : 8}
            bg="blue.500"
          ><Button onClick={() => remove(item.id)}> </Button>
            {item.size} item
            {item.id}
          </ChakraGridItem>
        ))}
      </Grid>
    </Box>
  )
}

export default GridDashboard
