import { useLocation, useNavigate } from "react-router-dom";
import { usersService, app } from "../client";
import { UserForm } from "../components/UserLogin";
import {
  Square,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "/home";
  const navigate = useNavigate();

  return (
    <Square borderWidth="1px" borderRadius="lg">
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Log In</Tab>
          <Tab>New User</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserForm
              onSubmit={(data) =>
                app.authenticate({ strategy: "local", ...data })
              }
              submitLabel="Login"
              onSuccess={() => {
                return navigate(from);
              }}
            />
          </TabPanel>
          <TabPanel>
            {/* TODO: onSubmit={usersService.create} is not working */}
            <UserForm
              onSubmit={(data) => usersService.create(data)}
              submitLabel="Create User"
              onSuccess={() => {
                return navigate(from);
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Square>
  );
};
