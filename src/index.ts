import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { createApplication } from 'graphql-modules'
import cors from 'cors'

import rootModule from './modules/root'
import todoItemModule from './modules/todoItem'
import getDatabase, { connectToDatabase } from './lib/database'

const server = express()
const port = 4000

server.get('/', (req, res) => {
  res.send('Hello world')
})

server.use(express.json())

const application = createApplication({
  modules: [rootModule, todoItemModule],
})

const schema = application.schema
const execute = application.createExecution()

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
}

server.use(cors(corsOptions))

server.use(
  '/',
  graphqlHTTP({
    schema,
    customExecuteFn: execute,
    graphiql: true,
  })
)

connectToDatabase((error) => {
  if (error || !getDatabase()) {
    console.log('Could not connect to database')
    process.exit(1)
  }

  console.log('Connected to SQLite database')

  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
})
