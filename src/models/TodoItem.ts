import { v4 as generateId } from 'uuid'

import {
  UpdateTodoItemInput,
  TodoItem as TodoItemGql,
} from '../generated/graphql'
import getDatabase from '../lib/database'
import logger from '../logger'
import { TodoItemModel } from './index'

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

  static create(args: CreateTodoItemArgs): Promise<string> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const id = this.generateNewId()

    return new Promise<string>((resolve, reject) => {
      databaseHandle.run(
        `
          insert into todoItems (
            id,
            title,
            isCompleted,
            dateCreated,
            timeCreated,
            timezoneCreated
          ) values (
            ?,
            ?,
            ?,
            ?
          )
        `,
        [id, args.title, 0, new Date().toISOString()],
        (error) => {
          if (error) {
            reject(error)
          }

          logger.log('info', `Created todo item ${id}`)

          resolve(id)
        }
      )
    })
  }

  static find(filter?: Partial<TodoItemGql>): Promise<TodoItemModel[]> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const filterParams: (keyof TodoItemGql)[] = [
      'id',
      'description',
      'isCompleted',
      'notes',
      'title',
      'dateCompleted',
      'timeCompleted',
      'timezoneCompleted',
      'dateCreated',
      'timeCreated',
      'timezoneCreated',
    ]

    const conditionals: string[] = []
    const params: ValueOf<TodoItemGql>[] = []

    filterParams.forEach((param) => {
      let filterParam = filter ? filter[param] : undefined
      if (filterParam !== undefined && filterParam !== null) {
        conditionals.push(`${param} = ?`)

        params.push(filterParam)
      }
    })

    return new Promise((resolve, reject) => {
      databaseHandle.all(
        `
          select
            id,
            title,
            description,
            notes,
            isCompleted,
            dateCreated,
            timeCreated,
            timezoneCreated,
            dateCompleted,
            timeCompleted,
            timezoneCompleted
          from
            todoItems
          ${conditionals.length > 0 ? `where ${conditionals.join('and')}` : ''}
        `,
        params,
        (error, rows: TodoItemModel[]) => {
          if (error) {
            reject(error)
          }

          logger.log('info', 'Found todo items')

          resolve(rows)
        }
      )
    })
  }

  static delete({ id }: { id: string }): Promise<void> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    return new Promise((resolve, reject) => {
      databaseHandle.run(
        `
          delete from todoItems where id = ?;
        `,
        [id],
        (error) => {
          if (error) {
            reject()
          }

          logger.log('info', `Successfully deleted todo item ${id}`)

          resolve()
        }
      )
    })
  }

  static update(args: Partial<TodoItemModel>): Promise<void> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const updateParams: (keyof Partial<TodoItemModel>)[] = [
      'description',
      'isCompleted',
      'notes',
      'title',
      'dateCompleted',
      'timeCompleted',
      'timezoneCompleted',
      'dateCreated',
      'timeCreated',
      'timezoneCreated',
    ]

    const set: string[] = []
    const params: ValueOf<TodoItemModel>[] = []

    updateParams.forEach((updateParam) => {
      const param = args ? args[updateParam] : undefined
      if (param !== undefined) {
        set.push(`${updateParam} = ?`)
        params.push(param)
      }
    })

    return new Promise((resolve, reject) => {
      databaseHandle.run(
        `
          update
            todoItems
          ${set.length > 0 ? `set ${set.join(',')}` : ''}
          where id = ?
        `,
        [...params, args.id],
        (error) => {
          if (error) {
            reject(error)
          }

          logger.log('info', `Successfully updated todo item ${args.id}`)

          resolve()
        }
      )
    })
  }
}
