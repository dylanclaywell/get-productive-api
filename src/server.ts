import express from 'express'
import http from 'http'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import { createApplication } from 'graphql-modules'

import { root, tag, todoItem } from './modules'
import logger from './logger'
import authMiddleware from './auth'

export function startServer({ port }: { port: number }) {
  const app = express()

  app.use(express.json())

  const application = createApplication({
    modules: [root, todoItem, tag],
  })

  const schema = application.schema
  const execute = application.createExecution()

  const corsOptions: cors.CorsOptions = {
    origin: ['http://localhost:3000'],
  }

  app.use(cors(corsOptions))

  app.use(authMiddleware)

  app.use(
    '/',
    graphqlHTTP({
      schema,
      customExecuteFn: execute,
      graphiql: true,
    })
  )

  logger.log('info', 'Connected to SQLite database')

  const server = app.listen(port, () => {
    logger.log('info', `Listening at http://localhost:${port}`)
  })

  setupCloseOnExit(server)

  return server
}

function setupCloseOnExit(server: http.Server) {
  function exitHandler({ exit }: { exit: boolean }) {
    server.close((error) => {
      if (error) {
        logger.log('error', 'Something went wrong closing the server')
        return
      }

      logger.log('info', 'Server successfully closed')

      if (exit) {
        process.exit()
      }
    })
  }

  process.on('exit', exitHandler)

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}
