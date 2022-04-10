import { v4 as generateId } from 'uuid'

import logger from '../logger'
import { TodoItemModel } from './index'
import datastore from '../datastore'

export interface CreateTodoItemArgs {
  uid: string
  title: string
  dateCreated: string
  timeCreated: string
  timezoneCreated: string
}

export default class TodoItem {
  static async todoItemExists(id: string): Promise<boolean> {
    const [todoItem] = await datastore.get(datastore.key(['todoItem', id]))
    return Boolean(todoItem)
  }

  static async generateNewId() {
    let id = generateId()
    while (await this.todoItemExists(id)) {
      id = generateId()
    }

    return id
  }

  static async create(args: CreateTodoItemArgs): Promise<string> {
    const id = await this.generateNewId()

    try {
      await datastore.insert({
        key: datastore.key(['todoItem', id]),
        data: {
          id,
          uid: args.uid,
          title: args.title,
          isCompleted: false,
          dateCreated: args.dateCreated,
          timeCreated: args.timeCreated,
          timezoneCreated: args.timezoneCreated,
        },
      })
      logger.log('info', `Successfully created todo item ${id}`)
    } catch {
      logger.log('error', `Error creating todo item ${id}`)
    }

    return id
  }

  static async find(
    filter: Partial<TodoItemModel> & {
      overrideIncompleteItems?: boolean
      uid: string
    }
  ): Promise<TodoItemModel[]> {
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
      'uid',
    ]

    const query = datastore.createQuery('todoItem')

    filterParams.forEach((param) => {
      let filterParam = filter ? filter[param] : undefined
      if (filterParam !== undefined && filterParam !== null) {
        query.filters.push({ name: param, op: '=', val: filterParam })
      }
    })

    const incompleteTodoitems = []
    if (filter?.overrideIncompleteItems) {
      const incompleteQuery = datastore
        .createQuery('todoItem')
        .filter('isCompleted', '=', false)
        .filter('uid', '=', filter.uid)
      const [incomplete] = await datastore.runQuery(incompleteQuery)
      incompleteTodoitems.push(...incomplete)
    }

    try {
      const [todoItems] = await datastore.runQuery(query)
      logger.log('info', 'Successfully found todo items')
      return [...todoItems, ...incompleteTodoitems] as TodoItemModel[]
    } catch {
      logger.log('error', 'Error finding todo items')
      return []
    }
  }

  static async delete({ id }: { id: string }): Promise<void> {
    const todoItemKey = datastore.key(['todoItem', id])

    try {
      await datastore.delete(todoItemKey)
      logger.log('info', `Successfully deleted todo item ${id}`)
    } catch {
      logger.log('error', `Error deleting todo item ${id}`)
    }
  }

  static async update(
    args: Omit<Partial<TodoItemModel>, 'uid'> & { id: string }
  ): Promise<void> {
    try {
      await datastore.update({
        key: datastore.key(['todoItem', args.id]),
        data: args,
      })
      logger.log('info', `Successfully updated todo item ${args.id}`)
    } catch {
      logger.log('error', `Error updating todo item ${args.id}`)
    }
  }
}
