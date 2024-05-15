// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import { Paginated } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Home, HomeData, HomePatch, HomeQuery } from './home.schema'

export type { Home, HomeData, HomePatch, HomeQuery }

export interface HomeParams extends MongoDBAdapterParams<HomeQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class HomeService<ServiceParams extends Params = HomeParams> extends MongoDBService<
  Home,
  HomeData,
  HomeParams,
  HomePatch
> {
  async find(
    params?: ServiceParams & { paginate?: { paginate?: { default?: number; max?: number } } }
  ): Promise<Paginated<Home>>
  async find(params?: ServiceParams & { paginate: false }): Promise<Home[]>
  async find(params?: ServiceParams): Promise<Paginated<Home> | Home[]>
  async find(params?: ServiceParams): Promise<Paginated<Home> | Home[]> {
    return super.find({...params,  query: { $select: ["name"] }, paginate: false})
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('facts'))
  }
}
