import { v4 as generateId } from 'uuid'

import getDatabase from '../lib/database'
import { TodoItemTable } from '../types/TodoItems'

type ValueOf<T> = T[keyof T]

export interface TodoItemProps {
  id: string
  title: string
  description?: string
  notes?: string
  isCompleted: boolean
  dateCompleted: Date | undefined
  dateCreated: Date
}

export interface CreateTodoItemArgs {
  title: string
}

export default class TodoItem {
  static todoItemExists(id: string): boolean {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    let todoItems: { id: string }[] = []

    databaseHandle.serialize(() => {
      databaseHandle.each(
        'select id from todoItems where id = ?',
        [id],
        (error, row) => {
          todoItems.push(row)
        }
      )
    })

    return todoItems.length > 0
  }

  static generateNewId() {
    let id = generateId()
    while (this.todoItemExists(id)) {
      id = generateId()
    }

    return id
  }

  static create(args: CreateTodoItemArgs) {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const id = this.generateNewId()

    databaseHandle.serialize(() => {
      const statement = databaseHandle.prepare(`
        insert into todoItems (
          id,
          title,
          isCompleted,
          dateCreated
        ) values (
          ?,
          ?,
          ?,
          ?
        )
      `)

      statement.run(id, args.title, 0, new Date().toISOString())
      statement.finalize()
    })
  }

  static find(filter?: Partial<TodoItemTable>): Promise<TodoItemTable[]> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const filterParams: (keyof TodoItemTable)[] = [
      'id',
      'description',
      'isCompleted',
      'notes',
      'title',
      'dateCompleted',
      'dateCreated',
    ]

    const conditionals: string[] = []
    const params: ValueOf<TodoItemTable>[] = []

    filterParams.forEach((param) => {
      const filterParam = filter ? filter[param] : undefined
      if (filterParam) {
        conditionals.push(`${param} = ?`)
        params.push(filterParam)
      }
    })

    return new Promise((resolve, reject) => {
      databaseHandle.serialize(() => {
        databaseHandle.all(
          `
          select
            id,
            title,
            description,
            notes,
            isCompleted,
            dateCreated,
            dateCompleted
          from
            todoItems
          ${conditionals.length > 0 ? `where ${conditionals.join('and')}` : ''}
        `,
          params,
          (error, rows: TodoItemTable[]) => {
            if (error) {
              reject(error)
            }

            resolve(rows)
          }
        )
      })
    })
  }
}
