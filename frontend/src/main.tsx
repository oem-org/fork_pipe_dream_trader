import React from "react"
import ReactDOM from "react-dom/client"
import Root from "./pages/Root.tsx"
import "./index.css"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import CoinListPage from "./pages/CoinListPage.tsx"
import CoinPage from "./pages/CoinPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import StrategyPage from "./pages/StrategyPage.tsx"

//
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage></NotFoundPage>,
    children: [
      {
        path: "/coins",
        element: <CoinListPage />,
      },
      {
        path: "/coins/:id",
        element: <CoinPage />,
      },
      {
        path: "/backtest",
        element: <StrategyPage />,
      },
    ],
  },




])

// when we pass this client we have access to cache 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 1,
    },
  },
})

const theme = extendTheme({
  colors: {
    custom: {
      light: "black",
      dark: "#1f2022",
    },
  },
})

export default theme;


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {/* <App /> */}
        <RouterProvider router={router} />

        <ReactQueryDevtools></ReactQueryDevtools>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
