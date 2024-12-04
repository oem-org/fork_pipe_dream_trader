import React from "react"
import ReactDOM from "react-dom/client"
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import StrategyPage from "./pages/strategy-page.tsx"
import NotFoundPage from "./pages/not-found-page.tsx"
import RootPage from "./pages/root-page.tsx"
import LoginPage from "./pages/login-page.tsx"
import SignupPage from "./pages/signup.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <NotFoundPage></NotFoundPage>,
    children: [
      {
        path: "/strategy",
        element: <StrategyPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      //{
      //  path: "/coins/:id",
      //  element: <CoinPage />,
      //},
    ],
  }])

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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
