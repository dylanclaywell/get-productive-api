import fs from 'fs'
import path from 'path'
import { v4 as generateId } from 'uuid'

export interface TodoItemArgs {
  id: string
  title: string
  description?: string
  notes?: string
  tags?: string[]
  isCompleted: boolean
  dateCompleted: Date | undefined
  dateCreated: Date
}

export interface CreateTodoItemArgs {
  title: string
}

export default class TodoItem {
  static todoItemExists(id: string) {
    return fs.existsSync(
      path.resolve(__dirname, `../../data/todo-items/todo-item-${id}.json`)
    )
  }

  static generateNewId() {
    let id = generateId()
    while (this.todoItemExists(id)) {
      id = generateId()
    }

    return id
  }

  static create(args: CreateTodoItemArgs) {
    const id = this.generateNewId()
    const filename = path.resolve(
      __dirname,
      `../../data/todo-items/todo-item-${id}.json`
    )

    const todoItem: TodoItemArgs = {
      id,
      dateCompleted: undefined,
      dateCreated: new Date(),
      isCompleted: false,
      title: args.title,
    }

    fs.writeFileSync(filename, JSON.stringify(todoItem))
  }
}
