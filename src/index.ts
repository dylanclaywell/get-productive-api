import express from 'express'

import api from './api'
import getDatabase, { connectToDatabase } from './lib/database'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())

app.use(api)

connectToDatabase((error) => {
  if (error || !getDatabase()) {
    console.log('Could not connect to database')
    process.exit(1)
  }

  console.log('Connected to SQLite database')

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
})
