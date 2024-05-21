import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./routes/Login";
import { Layout } from "./components/Layout";
import { protectedLoader } from "./components/ProtectionProvider";
import { Home } from "./routes/Home";
import { Quiz } from "./routes/Quiz";
import { Admin } from "./routes/Admin";
import ErrorPage from "./components/Error";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "home",
        loader: protectedLoader,
        element: <Home />,
      },
      {
        path: "quiz",
        loader: protectedLoader,
        element: <Quiz />,
      },
      {
        path: "admin",
        loader: protectedLoader,
        element: <Admin />,
      },
    ],
  },
]);

export function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}
