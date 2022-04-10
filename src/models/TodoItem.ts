import { v4 as generateId } from 'uuid'

import {
  UpdateTodoItemInput,
  TodoItem as TodoItemGql,
} from '../generated/graphql'
import getDatabase from '../database'
import logger from '../logger'
import { ValueOf } from '../utils/ValueOf'
import { TodoItemModel } from './index'
import datastore from '../datastore'

export interface CreateTodoItemArgs {
  userId: string
  title: string
  dateCreated: string
  timeCreated: string
  timezoneCreated: string
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

  static async create(args: CreateTodoItemArgs): Promise<string> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const id = this.generateNewId()

    await datastore.insert({
      key: datastore.key('todoItem'),
      data: {
        id,
        userId: args.userId,
        title: args.title,
        isCompleted: false,
        dateCreated: args.dateCreated,
        timeCreated: args.timeCreated,
        timezoneCreated: args.timezoneCreated,
      },
    })

    return new Promise<string>((resolve, reject) => {
      databaseHandle.run(
        `
          insert into todoItems (
            userId,
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
            ?,
            ?,
            ?,
            ?
          )
        `,
        [
          args.userId,
          id,
          args.title,
          0,
          args.dateCreated,
          args.timeCreated,
          args.timezoneCreated,
        ],
        (error) => {
          if (error) {
            logger.log('error', `Error creating todo item: ${error.message}`)
            return reject(error)
          }

          logger.log('info', `Created todo item ${id}`)

          resolve(id)
        }
      )
    })
  }

  static async find(
    filter?: Partial<TodoItemModel> & {
      overrideIncompleteItems?: boolean
      userId: string
    }
  ): Promise<TodoItemModel[]> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const filterParams: (keyof TodoItemModel)[] = [
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
    const params: ValueOf<TodoItemModel>[] = []

    const query = datastore.createQuery('todoItem')

    filterParams.forEach((param) => {
      let filterParam = filter ? filter[param] : undefined
      if (filterParam !== undefined && filterParam !== null) {
        query.filters.push({ name: param, op: '=', val: filterParam })
        conditionals.push(`${param} = ?`)

        params.push(filterParam)
      }
    })

    let incompleteClause = ''
    const incompleteTodoitems = []
    if (filter?.overrideIncompleteItems) {
      const incompleteQuery = datastore
        .createQuery('todoItem')
        .filter('isCompleted', '=', false)
      const [incomplete] = await datastore.runQuery(incompleteQuery)
      incompleteTodoitems.push(...incomplete)
      incompleteClause = conditionals.length
        ? ' or isCompleted = 0'
        : 'isCompleted = 0'
    }

    const [todoItems] = await datastore.runQuery(query)

    return [...todoItems, ...incompleteTodoitems] as TodoItemModel[]

    // return new Promise((resolve, reject) => {
    //   databaseHandle.all(
    //     `
    //       select
    //         id,
    //         userId,
    //         title,
    //         description,
    //         notes,
    //         isCompleted,
    //         dateCreated,
    //         timeCreated,
    //         timezoneCreated,
    //         dateCompleted,
    //         timeCompleted,
    //         timezoneCompleted
    //       from
    //         todoItems
    //       ${
    //         conditionals.length > 0
    //           ? `where (${conditionals.join(' and ')})`
    //           : ''
    //       }
    //       ${incompleteClause}
    //     `,
    //     params,
    //     (error, rows: TodoItemModel[]) => {
    //       if (error) {
    //         logger.log('error', `Error finding todo items: ${error.message}`)
    //         return reject(error)
    //       }

    //       logger.log('info', 'Found todo items')

    //       resolve(rows)
    //     }
    //   )
    // })
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
            logger.log('error', `Error deleting todo item: ${error.message}`)
            return reject()
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
            logger.log('error', `Error updating todo item: ${error.message}`)
            return reject(error)
          }

          logger.log('info', `Successfully updated todo item ${args.id}`)

          resolve()
        }
      )
    })
  }
}
