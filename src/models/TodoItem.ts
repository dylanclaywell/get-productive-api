import { v4 as generateId } from 'uuid'

import getDatabase from '../lib/database'
import { TodoItem as TodoItemType } from '../types/TodoItems'

type ValueOf<T> = T[keyof T]

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

    return new Promise<void>((resolve, reject) => {
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
        statement.finalize((err) => {
          if (err) {
            reject(err)
          }

          resolve()
        })
      })
    })
  }

  static find(filter?: Partial<TodoItemType>): Promise<TodoItemType[]> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const filterParams: (keyof TodoItemType)[] = [
      'id',
      'description',
      'isCompleted',
      'notes',
      'title',
      'dateCompleted',
      'dateCreated',
    ]

    const conditionals: string[] = []
    const params: ValueOf<TodoItemType>[] = []

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
          (error, rows: TodoItemType[]) => {
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
