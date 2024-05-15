import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./routes/Login";
import { Layout } from "./components/Layout";
import { protectedLoader } from "./routes/ProtectionProvider";
import { Home } from "./routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    Component: Layout,
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
