// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  homeDataValidator,
  homePatchValidator,
  homeQueryValidator,
  homeResolver,
  homeExternalResolver,
  homeDataResolver,
  homePatchResolver,
  homeQueryResolver
} from './home.schema'

import type { Application } from '../../declarations'
import { HomeService, getOptions } from './home.class'

export const homePath = 'home'
export const homeMethods: Array<keyof HomeService> = ['find', 'get', 'create', 'patch', 'remove']

export * from './home.class'
export * from './home.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const home = (app: Application) => {
  // Register our service on the Feathers application
  app.use(homePath, new HomeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: homeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(homePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(homeExternalResolver),
        schemaHooks.resolveResult(homeResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(homeQueryValidator), schemaHooks.resolveQuery(homeQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(homeDataValidator), schemaHooks.resolveData(homeDataResolver)],
      patch: [schemaHooks.validateData(homePatchValidator), schemaHooks.resolveData(homePatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [homePath]: HomeService
  }
}
