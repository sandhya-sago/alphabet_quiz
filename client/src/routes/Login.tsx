import { usersService, app } from '../client'
import { UserForm } from '../components/UserLogin'
import { Square, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


export const Login = () =>
(
    <Square borderWidth='1px' borderRadius='lg'>
        <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
                <Tab>New User</Tab>
                <Tab>Log In</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    {/* TODO: onSubmit={usersService.create} is not working */}
                    <UserForm onSubmit={(data) => usersService.create(data)} submitLabel='Create User' />
                </TabPanel>
                <TabPanel>
                    <UserForm onSubmit={(data) => app.authenticate({ "strategy": "local", ...data })} submitLabel='Login' />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Square>
)
