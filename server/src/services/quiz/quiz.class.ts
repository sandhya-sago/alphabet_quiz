// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Quiz, QuizData, QuizPatch, QuizQuery } from './quiz.schema'
import { ObjectId } from 'mongodb'
import { Paginated } from '@feathersjs/feathers'
import { app } from '../../app'

export type { Quiz, QuizData, QuizPatch, QuizQuery }

export interface QuizParams extends MongoDBAdapterParams<QuizQuery> {}

const selectRandom = <T>(arr: T[], N: number) => {
  const randomIdxs = [...new Set(arr.map(() => (Math.random() * arr.length) | 0))].slice(0, N)
  return randomIdxs.map((i) => arr[i])
}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class QuizService<ServiceParams extends Params = QuizParams> extends MongoDBService<
  Quiz,
  QuizData,
  QuizParams,
  QuizPatch
> {
  async find(
    params?: ServiceParams & { paginate?: { paginate?: { default?: number; max?: number } } }
  ): Promise<Paginated<Quiz>>
  async find(params?: ServiceParams & { paginate: false }): Promise<Quiz[]>
  async find(params?: ServiceParams): Promise<Paginated<Quiz> | Quiz[]>
  async find(params?: ServiceParams): Promise<Paginated<Quiz> | Quiz[]> {
    let selectedTopicIds = []
    if (params?.query?._id?.$in) {
      selectedTopicIds = params.query._id.$in
    } else {
      const home = app.service('home')
      const topics = await home.find()
      selectedTopicIds = selectRandom(topics, 5).map((t) => t._id)
    }
    const ids = selectedTopicIds.map((id: string) => new ObjectId(id))
    const collection = await this.getModel()
    const cursor = collection.find({ _id: { $in: ids } })
    const data = await cursor.toArray()
    // Now select the appropriate alphabets
    const allAvalAlpha = data.map((h) =>
      Object.entries(h.alphabets)
        .filter(([_, val]) => !!val.toLowerCase().replace('none', '').replace('-', '').trim())
        .map((pair) => pair[0])
    )
    const avalAlpha = allAvalAlpha.reduce((a, b) => a.filter((c) => b.includes(c)))
    return { topics: data.map((h) => h.name), alphabets: selectRandom(avalAlpha, 5) }
  }

  async getAnswers(data: QuizData, params: Params) {
    const collection = await this.getModel()
    const cursor = collection.find({ name: { $in: data.topics } })
    const result = await cursor.toArray()
    const answers = result.reduce(
      (obj, r) => ({
        ...obj,
        [r.name]: Object.fromEntries(
          Object.entries(r.alphabets).filter(([alpha, _]) => data.alphabets.includes(alpha))
        )
      }),
      {}
    )
    return answers
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('facts'))
  }
}
