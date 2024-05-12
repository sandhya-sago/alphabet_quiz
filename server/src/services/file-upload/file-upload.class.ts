// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { FileUpload, FileUploadData, FileUploadPatch, FileUploadQuery } from './file-upload.schema'
import { fileUploadPath } from './file-upload'

export type { FileUpload, FileUploadData, FileUploadPatch, FileUploadQuery }

export interface FileUploadParams extends MongoDBAdapterParams<FileUploadQuery> {
}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class FileUploadService<ServiceParams extends Params = FileUploadParams> extends MongoDBService<
  FileUpload,
  FileUploadData,
  FileUploadParams,
  FileUploadPatch
> {
  path: string = ''
  async setup(app: Application, path: string) {this.path = path; console.log({path }, app.routes.getPath(fileUploadPath))}
  async create(data: FileUploadData, params?: ServiceParams): Promise<FileUpload>
  async create(data: FileUploadData[], params?: ServiceParams): Promise<FileUpload[]>
  async create(data: FileUploadData | FileUploadData[], params?: ServiceParams): Promise<FileUpload | FileUpload[]> {
    console.log("Got to create: ", {data, params})
    return super.create(data, params)
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('file-upload'))
  }
}
