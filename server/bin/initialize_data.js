#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { open } from 'node:fs/promises'
import { MongoClient } from 'mongodb'
import { exit } from 'node:process'
import csv from 'csvtojson'

// const args = ['-f', './data/alphabet_quiz.csv'];

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const options = {
  file: {
    type: 'string',
    short: 'f'
  }
}
const { values } = parseArgs({ options, strict: true })
console.log('File to be read:', values.file)

const data = await csv().fromFile(values.file)

let topics = []
for (const row of data) {
  let alpha = ''
  for (const [key, value] of Object.entries(row)) {
    if (key.startsWith('field')) {
      alpha = value.toUpperCase()
      continue
    }
    if (!(key in topics)) {
      topics[key] = {}
    }
    topics[key][alpha] = value.replace(/\s+/g, ' ').trim()
  }
}
// TODO: combine topics and docs into one step
const docs = Object.entries(topics).reduce(
  (obj, [key, value]) => [...obj, { name: key, alphabets: value }],
  []
)

const uri = 'mongodb://localhost:27017'
const mongo = new MongoClient(uri)
try {
  await mongo.connect()
} catch (err) {
  console.error('Could not connect to mongo\n', err)
}
try {
  const db = mongo.db('server')
  await db.collection('facts').drop()
  const factsCollection = await db.createCollection('facts', { collation: { locale: 'en', strength: 2 } })
  const result = await factsCollection.insertMany(docs, { ordered: true })
  console.log(`${result.insertedCount} documents were inserted`)
  await factsCollection.createIndex({ name: 1 }, { unique: true })
} finally {
  await mongo.close()
}
