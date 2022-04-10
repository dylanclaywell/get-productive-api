import 'dotenv/config'
import { startServer } from './server'

startServer({ port: parseInt(process.env.PORT ?? '4000') })
