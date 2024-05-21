// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { QuizService } from './quiz.class'

// Main data model schema
export const quizSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    topics: Type.Array(Type.String()),
    alphabets: Type.Array(Type.String())
  },
  { $id: 'Quiz', additionalProperties: false }
)
export type Quiz = Static<typeof quizSchema>
export const quizValidator = getValidator(quizSchema, dataValidator)
export const quizResolver = resolve<Quiz, HookContext<QuizService>>({})

export const quizExternalResolver = resolve<Quiz, HookContext<QuizService>>({})

// Schema for creating new entries
export const quizDataSchema = Type.Pick(quizSchema, ['topics', 'alphabets'], {
  $id: 'QuizData'
})
export type QuizData = Static<typeof quizDataSchema>
export const quizDataValidator = getValidator(quizDataSchema, dataValidator)
export const quizDataResolver = resolve<Quiz, HookContext<QuizService>>({})

// Schema for updating existing entries
export const quizPatchSchema = Type.Partial(quizSchema, {
  $id: 'QuizPatch'
})
export type QuizPatch = Static<typeof quizPatchSchema>
export const quizPatchValidator = getValidator(quizPatchSchema, dataValidator)
export const quizPatchResolver = resolve<Quiz, HookContext<QuizService>>({})

// Schema for allowed query properties
export const quizQueryProperties = Type.Pick(quizSchema, ['_id', 'topics', 'alphabets'])
export const quizQuerySchema = Type.Intersect(
  [
    querySyntax(quizQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type QuizQuery = Static<typeof quizQuerySchema>
export const quizQueryValidator = getValidator(quizQuerySchema, queryValidator)
export const quizQueryResolver = resolve<QuizQuery, HookContext<QuizService>>({})
