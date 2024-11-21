import { Grid, GridItem } from "@chakra-ui/react";
import CustomGrid from "src/components/CustomGrid";
// import GridDashboard from "src/components/grid-dashboard/GridDashboard";
// import SideBar from "src/components/navigationBars/SideBar";

function DashboardPage() {
  return (
    <Grid
      templateAreas={{
        base: '"main"',
        lg: '"aside main main main main"',
      }}
    >
      <GridItem gridArea={"main"}>
        <CustomGrid />
      </GridItem>
      {/* <GridDashboard /> */}
    </Grid>
  );
}

export default DashboardPage;
