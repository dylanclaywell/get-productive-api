import { v4 as generateId } from 'uuid'

import { TagModel } from './index'
import getDatabase from '../lib/database'
import logger from '../logger'
import { ValueOf } from '../utils/ValueOf'

export default class Tag {
  static tagExists(id: string): boolean {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    let tags: { id: string }[] = []

    databaseHandle.serialize(() => {
      databaseHandle.each(
        'select id from tags where id = ?',
        [id],
        (error, row) => {
          tags.push(row)
        }
      )
    })

    return tags.length > 0
  }

  static generateNewId() {
    let id = generateId()
    while (this.tagExists(id)) {
      id = generateId()
    }

    return id
  }

  static find(filter?: Partial<TagModel>): Promise<TagModel[]> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const filterParams: (keyof TagModel)[] = ['id', 'name', 'color']

    const conditionals: string[] = []
    const params: ValueOf<TagModel>[] = []

    filterParams.forEach((param) => {
      let filterParam = filter ? filter[param] : undefined
      if (filterParam !== undefined && filterParam !== null) {
        conditionals.push(`${param} = ?`)

        params.push(filterParam)
      }
    })

    return new Promise((resolve, reject) =>
      databaseHandle.all(
        `
          select
            id,
            name,
            color
          from
            tags
          ${
            conditionals.length > 0
              ? `where (${conditionals.join(' and ')})`
              : ''
          }
        `,
        params,
        (error, rows: TagModel[]) => {
          if (error) {
            return reject(error)
          }

          resolve(rows)
        }
      )
    )
  }

  static async findByTodoItemId(id: string) {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database handle')
    }

    return new Promise<TagModel[]>((resolve, reject) =>
      databaseHandle.all(
        `
        select
          id,
          name,
          color
        from
          tags t
        join
          todoItemTags tt
        on
          t.id = tt.tagId
          and tt.todoItemId = ?
        `,
        [id],
        (error, rows: TagModel[]) => {
          if (error) {
            return reject(error)
          }

          resolve(rows)
        }
      )
    )
  }

  static async create({
    name,
    color,
  }: {
    name: string
    color: string
  }): Promise<{ id: string }> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database handle')
    }

    const id = this.generateNewId()

    return new Promise((resolve, reject) =>
      databaseHandle.run(
        `
        insert into tags (
          id,
          name,
          color
        ) values (
          ?,
          ?,
          ?
        )
      `,
        [id, name, color],
        (error) => {
          if (error) {
            logger.log('error', `Error deleting todo item: ${error.message}`)
            return reject()
          }

          logger.log('info', `Successfully created todo item ${id}`)

          resolve({ id })
        }
      )
    )
  }

  static update(
    args: { id: string } & Omit<Partial<TagModel>, 'id'>
  ): Promise<void> {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    const updateParams: (keyof TagModel)[] = ['name', 'color']

    const updates: string[] = []
    const params: ValueOf<TagModel>[] = []

    updateParams.forEach((param) => {
      let updateParam = args ? args[param] : undefined
      if (updateParam !== undefined && updateParam !== null) {
        updates.push(`${param} = ?`)

        params.push(updateParam)
      }
    })

    return new Promise((resolve, reject) =>
      databaseHandle.all(
        `
          update
            tags
          set
          ${updates.length > 0 ? updates.join(',') : ''}
          where
            id = ?
        `,
        [...params, args.id],
        (error) => {
          if (error) {
            logger.log('error', `Error updating todo item: ${error.message}`)
            return reject()
          }

          resolve()
        }
      )
    )
  }
}
