// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { HomeService } from './home.class'

// Main data model schema
export const homeSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    alphabets: Type.Record(Type.String(), Type.String())
  },
  { $id: 'Home', additionalProperties: false }
)
export type Home = Static<typeof homeSchema>
export const homeValidator = getValidator(homeSchema, dataValidator)
export const homeResolver = resolve<Home, HookContext<HomeService>>({})

export const homeExternalResolver = resolve<Home, HookContext<HomeService>>({})

// Schema for creating new entries
export const homeDataSchema = Type.Pick(homeSchema, ['name', 'alphabets'], {
  $id: 'HomeData'
})
export type HomeData = Static<typeof homeDataSchema>
export const homeDataValidator = getValidator(homeDataSchema, dataValidator)
export const homeDataResolver = resolve<Home, HookContext<HomeService>>({})

// Schema for updating existing entries
export const homePatchSchema = Type.Partial(homeSchema, {
  $id: 'HomePatch'
})
export type HomePatch = Static<typeof homePatchSchema>
export const homePatchValidator = getValidator(homePatchSchema, dataValidator)
export const homePatchResolver = resolve<Home, HookContext<HomeService>>({})

// Schema for allowed query properties
export const homeQueryProperties = Type.Pick(homeSchema, ['_id', 'name'])
export const homeQuerySchema = Type.Intersect(
  [
    querySyntax(homeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type HomeQuery = Static<typeof homeQuerySchema>
export const homeQueryValidator = getValidator(homeQuerySchema, queryValidator)
export const homeQueryResolver = resolve<HomeQuery, HookContext<HomeService>>({})
