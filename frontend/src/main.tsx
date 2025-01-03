import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StrategyPage from "./pages/strategy-page.tsx";
import NotFoundPage from "./pages/not-found-page.tsx";
import RootPage from "./pages/root-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import SignupPage from "./pages/signup.tsx";
import CreateStrategyPage from "./pages/create-strategy-page.tsx";
import SelectStrategyPage from "./pages/select-strategy-page.tsx";
import ProtectedRoute from "./components/auth/protected-route.tsx";
import DataPage from "./pages/data-page.tsx";
import HomePage from "./pages/home-page.tsx";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 2000 * 60 * 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootPage />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // This sets the default child for "/"
        element: <HomePage />,
      }, {
        path: "data",
        element: <DataPage />,
      },
      {
        path: "strategy/:id",
        element: <StrategyPage />,
      },
      {
        path: "create-strategy",
        element: <CreateStrategyPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);


//<React.StrictMode>
//
//</React.StrictMode >
