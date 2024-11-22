import { Grid } from "@chakra-ui/react"



const CustomGrid = () => {
return (
    <Grid
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(3, 1fr)'
  gap={4}
>
</Grid>
)
}

export default CustomGrid


