import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
export const Layout = () => (
  <>
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={"50px 1fr 30px"}
      gridTemplateColumns={"150px 1fr"}
      h="100vh"
      w="100vw"
      gap="1"
    >
      <GridItem
        pl="2"
        bg="gray.200"
        borderWidth="1px"
        borderRadius="lg"
        area={"header"}
      >
        Header
      </GridItem>
      <GridItem
        pl="2"
        bg="gray.200"
        borderWidth="1px"
        borderRadius="lg"
        area={"nav"}
      >
        Nav
      </GridItem>
      <GridItem pl="2" area={"main"}>
        <Outlet />
      </GridItem>
      <GridItem
        pl="2"
        bg="gray.200"
        borderWidth="1px"
        borderRadius="lg"
        area={"footer"}
      >
        Footer
      </GridItem>
    </Grid>
  </>
);
