import React from "react"
import ReactDOM from "react-dom/client"
import Root from "./pages/Root.tsx"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import StrategyPage from "@/pages/Strategy.tsx"
import NotFoundPage from "@/pages/NotFoundPage.tsx"

//
const router = createBrowserRouter([
  {

    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage></NotFoundPage>,
    children: [
      {
        path: "/strategy",
        element: <StrategyPage />,
      },
      //{
      //  path: "/coins/:id",
      //  element: <CoinPage />,
      //},
      //{
      //  path: "/backtest",
      //  element: <StrategyPage />,
      //},
    ],
  }, {

  }
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




ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools></ReactQueryDevtools>
    </QueryClientProvider>
  </React.StrictMode>
)
