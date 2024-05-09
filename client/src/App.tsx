import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./routes/Login";
import { Layout } from "./components/Layout";
import { protectedLoader } from "./routes/ProtectionProvider";

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
        Component: () => <>This is a protected home page</>,
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
