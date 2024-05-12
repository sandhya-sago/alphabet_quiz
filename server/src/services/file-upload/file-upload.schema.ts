// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FileUploadService } from './file-upload.class'

// Main data model schema
export const fileUploadSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    fileType: Type.String(),
    // TODO: WE do not need text, deal with it later, not sure how it is being used
    text: Type.String()
  },
  { $id: 'FileUpload', additionalProperties: false }
)
export type FileUpload = Static<typeof fileUploadSchema>
export const fileUploadValidator = getValidator(fileUploadSchema, dataValidator)
export const fileUploadResolver = resolve<FileUpload, HookContext<FileUploadService>>({})

export const fileUploadExternalResolver = resolve<FileUpload, HookContext<FileUploadService>>({})

// Schema for creating new entries
export const fileUploadDataSchema = Type.Pick(fileUploadSchema, ['text', 'fileType'], {
  $id: 'FileUploadData'
})
export type FileUploadData = Static<typeof fileUploadDataSchema>
export const fileUploadDataValidator = getValidator(fileUploadDataSchema, dataValidator)
export const fileUploadDataResolver = resolve<FileUpload, HookContext<FileUploadService>>({})

// Schema for updating existing entries
export const fileUploadPatchSchema = Type.Partial(fileUploadSchema, {
  $id: 'FileUploadPatch'
})
export type FileUploadPatch = Static<typeof fileUploadPatchSchema>
export const fileUploadPatchValidator = getValidator(fileUploadPatchSchema, dataValidator)
export const fileUploadPatchResolver = resolve<FileUpload, HookContext<FileUploadService>>({})

// Schema for allowed query properties
export const fileUploadQueryProperties = Type.Pick(fileUploadSchema, ['_id', 'text', 'fileType'])
export const fileUploadQuerySchema = Type.Intersect(
  [
    querySyntax(fileUploadQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FileUploadQuery = Static<typeof fileUploadQuerySchema>
export const fileUploadQueryValidator = getValidator(fileUploadQuerySchema, queryValidator)
export const fileUploadQueryResolver = resolve<FileUploadQuery, HookContext<FileUploadService>>({})
