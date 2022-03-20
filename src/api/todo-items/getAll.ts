import { Request, Response } from 'express'
import isObject from '../../lib/isObject'
import TodoItem from '../../models/TodoItem'
import { TodoItemTable } from '../../types/TodoItems'

function paramsAreValid(params: unknown): params is { id: string } {
  return isObject(params) && 'id' in params
}

export default async function getAll(req: Request, res: Response) {
  let todoItems: TodoItemTable[] = []
  try {
    todoItems = await TodoItem.find()
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Error finding todo item' })
  }

  res.status(200).json(todoItems)
}
