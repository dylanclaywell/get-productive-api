import { Request, Response } from 'express'
import isObject from '../../lib/isObject'
import TodoItem from '../../models/TodoItem'
import { TodoItemTable } from '../../types/TodoItems'

function paramsAreValid(params: unknown): params is { id: string } {
  return isObject(params) && 'id' in params
}

export default async function getById(req: Request, res: Response) {
  const params: unknown = req.params

  if (!paramsAreValid(params)) {
    res.status(400).json({ message: 'Invalid request (1)' })
    return
  }

  let todoItems: TodoItemTable[] = []
  try {
    todoItems = (await TodoItem.find({ id: params.id })) as any
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Error finding todo item' })
  }

  res.status(200).json(todoItems)
}
