import express from 'express'

import api from './api'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())

app.use(api)

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
