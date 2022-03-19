import { Request, Response } from 'express'

import TodoItem, { CreateTodoItemArgs } from '../../models/TodoItem'
import isObject from '../../lib/isObject'

function bodyIsValid(body: unknown): body is CreateTodoItemArgs {
  return isObject(body) && 'title' in body
}

export default function create(req: Request, res: Response) {
  const body: unknown = req.body

  if (!bodyIsValid(body)) {
    res.status(400).json({ message: 'Invalid request (1)' })
    return
  }

  try {
    TodoItem.create({
      title: body.title,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Error creating todo item' })
    return
  }

  res.status(201).json({ message: 'Todo item created' })
}
