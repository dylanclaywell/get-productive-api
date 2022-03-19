import express from 'express'

import todoItems from './todo-items'

const router = express.Router()

router.use('/api/todo-items', todoItems)

export default router
