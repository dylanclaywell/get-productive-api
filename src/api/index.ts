import express from 'express'

import createTodoItem from './createTodoItem'

const router = express.Router()

router.post('/api/createTodoItem', createTodoItem)

export default router
