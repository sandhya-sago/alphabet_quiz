// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import { Paginated } from '@feathersjs/feathers'
import { ObjectId } from 'mongodb'

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
    if (Object.keys(params?.query).length === 0) {
      // Cannot set paginate on the client side
      return super.find({ ...params, query: { $select: ['name'] }, paginate: false })
    } else if (params?.query?._id?.$in) {
      console.log('query with', params?.query?._id?.$in)
      const ids = params?.query?._id?.$in.map((id: string) => new ObjectId(id))
      const collection = await this.getModel()
      const cursor = collection.find({ _id: { $in: ids } })
      const data = await cursor.toArray()
      // Now select the appropriate alphabets
      // 1. filter for alphabets that have content.
      const allAvalAlpha = data.map((h) =>
        Object.entries(h.alphabets)
          .filter(([_, val]) => !!val.toLowerCase().replace('none', '').replace('-', '').trim())
          .map((pair) => pair[0])
      )
      const avalAlpha = allAvalAlpha.reduce((a, b) => a.filter((c) => b.includes(c)))
      const randomIdxs = [...new Set(avalAlpha.map(() => (Math.random() * avalAlpha.length) | 0))].slice(0, 5)
      const selectedAlpha = randomIdxs.map((i) => avalAlpha[i])
      return selectedAlpha
    } else {
      return super.find(params)
    }
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('facts'))
  }
}
