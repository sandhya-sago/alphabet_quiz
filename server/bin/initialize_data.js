#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { open } from 'node:fs/promises'
import { MongoClient } from 'mongodb'

// const args = ['-f', './data/alphabet_quiz.csv'];

const options = {
  file: {
    type: 'string',
    short: 'f'
  }
}
const { values } = parseArgs({ options, strict: true })
console.log('File to be read:', values.file)

const file = await open(values.file)

const lines = await file.readLines()
let header = []
for await (const line of lines) {
  // Read only the header
  header = line.split(',').map((f, i) => (f.length > 0 ? f : `field_${i}`))
  break
}
const data = header.map(() => [])
for await (const line of lines) {
  const answers = line.split(',')
  data.forEach((d, i) => {
    data[i].push(answers[i])
  })
}
// Note: Sometimes colums may repeat, overwrite the older one with righer one
const topics = header.reduce((obj, head, idx) => ({ ...obj, [head]: data[idx] }), {})

// console.log(topics)

const uri = 'mongodb://localhost:27017'
const mongo = new MongoClient(uri)
try {
  await mongo.connect()
} catch (err) {
  console.error('Could not connect to mongo\n', err)
}

const db = mongo.db('QuizDB')
await db.createCollection('dataCollection')

await mongo.close()
