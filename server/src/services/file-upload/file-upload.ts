// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import {  type HookContext, type NextFunction } from '@feathersjs/feathers'

import { hooks as schemaHooks } from '@feathersjs/schema'

import multer from 'multer'
// const multer = require('multer');
const multipartMiddleware = multer();
import {
  fileUploadDataValidator,
  fileUploadPatchValidator,
  fileUploadQueryValidator,
  fileUploadResolver,
  fileUploadExternalResolver,
  fileUploadDataResolver,
  fileUploadPatchResolver,
  fileUploadQueryResolver
} from './file-upload.schema'

import {koaBody} from 'koa-body'
import type { Application } from '../../declarations'
import { FileUploadService, getOptions } from './file-upload.class'

export const fileUploadPath = 'file-upload'
export const fileUploadMethods: Array<keyof FileUploadService> = ['create']

export * from './file-upload.class'
export * from './file-upload.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const fileUpload = (app: Application) => {
  // Register our service on the Feathers application
  app.use(fileUploadPath, new FileUploadService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fileUploadMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [
        async (ctx, next) => {
          ctx.feathers // data that will be merged into sevice `params`

          // This will run all subsequent middleware and the service call
          await next()

          // Then we have additional properties available on the context
          ctx.hook // the hook context from the method call
          ctx.body // the return value
        }
      ]
    }
  })
  // Initialize hooks
  app.service(fileUploadPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(fileUploadExternalResolver),
        schemaHooks.resolveResult(fileUploadResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(fileUploadQueryValidator),
        schemaHooks.resolveQuery(fileUploadQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        async (context: HookContext) => {
          console.log("context", context)
        }
      ],
      patch: [
        schemaHooks.validateData(fileUploadPatchValidator),
        schemaHooks.resolveData(fileUploadPatchResolver)
      ],
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
    [fileUploadPath]: FileUploadService
  }
}
