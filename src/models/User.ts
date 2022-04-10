import { v4 as generateId } from 'uuid'
import { UserModel } from '.'

import getDatabase from '../database'
import logger from '../logger'

export default class User {
  static userExists(id: string): boolean {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database connection')
    }

    let users: { id: string }[] = []

    databaseHandle.serialize(() => {
      databaseHandle.each(
        'select id from users where id = ?',
        [id],
        (error, row) => {
          if (error) {
            logger.log('error', 'Error checking if user exists')
          }
          users.push(row)
        }
      )
    })

    return users.length > 0
  }

  static generateNewId() {
    let id = generateId()
    while (this.userExists(id)) {
      id = generateId()
    }

    return id
  }

  static create({ uid }: { uid: string }) {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database handle')
    }

    const id = this.generateNewId()

    return new Promise<void>((resolve, reject) =>
      databaseHandle.run(
        `
        insert into users (
          id,
          uid
        ) values (
          ?,
          ?
        )
      `,
        [id, uid],
        (error) => {
          if (error) {
            logger.log('error', 'Error checking if user exists')
            reject(error)
          }

          logger.log('info', `Successfully created user ${id}`)

          resolve()
        }
      )
    )
  }

  static find({ uid }: { uid: string }) {
    const databaseHandle = getDatabase()

    if (!databaseHandle) {
      throw new Error('No database handle')
    }

    return new Promise<UserModel[]>((resolve, reject) =>
      databaseHandle.all(
        `
        select
          id,
          uid
        from
          users
        where
          uid = ?
      `,
        [uid],
        (error, rows: UserModel[]) => {
          if (error) {
            logger.log('error', 'Error finding users')
            reject(error)
          }

          logger.log('info', `Successfully found users`)

          resolve(rows)
        }
      )
    )
  }
}
