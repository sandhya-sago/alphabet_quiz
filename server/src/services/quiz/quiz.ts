// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  quizDataValidator,
  quizPatchValidator,
  quizQueryValidator,
  quizResolver,
  quizExternalResolver,
  quizDataResolver,
  quizPatchResolver,
  quizQueryResolver
} from './quiz.schema'

import type { Application } from '../../declarations'
import { QuizService, getOptions } from './quiz.class'

export const quizPath = 'quiz'
export const quizMethods: Array<keyof QuizService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
  'getAnswers'
]

export * from './quiz.class'
export * from './quiz.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const quiz = (app: Application) => {
  // Register our service on the Feathers application
  app.use(quizPath, new QuizService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: quizMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(quizPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(quizExternalResolver),
        schemaHooks.resolveResult(quizResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(quizQueryValidator), schemaHooks.resolveQuery(quizQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(quizDataValidator), schemaHooks.resolveData(quizDataResolver)],
      patch: [schemaHooks.validateData(quizPatchValidator), schemaHooks.resolveData(quizPatchResolver)],
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
    [quizPath]: QuizService
  }
}
