import { feathers } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'

import { SERVER_URL } from './constants'
const app = feathers()

// Connect to the same as the browser URL (only in the browser)
const restClient = rest(SERVER_URL)

// Configure an AJAX library (see below) with that client
app.configure(restClient.fetch(window.fetch.bind(window)))
app.configure(authentication())
// TODO: When logout, do app.logout()

const usersService = app.service('users');
const homeService = app.service('home')

export { app, usersService , homeService}