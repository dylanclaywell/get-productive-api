import express from 'express'

import create from './create'
import getAll from './getAll'
import find from './[id]'

const router = express.Router()

router.post('/create', create)
router.get('/:id', find)
router.get('/', getAll)

export default router
