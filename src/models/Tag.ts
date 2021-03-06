import { v4 as generateId } from 'uuid'

import { TagModel } from './index'
import datastore from '../datastore'

export default class Tag {
  static async tagExists(id: string): Promise<boolean> {
    const [tag] = await datastore.get(datastore.key(['tag', id]))
    return Boolean(tag)
  }

  static async generateNewId() {
    let id = generateId()
    while (await this.tagExists(id)) {
      id = generateId()
    }

    return id
  }

  static async find(
    filter?: Partial<TagModel> & { uid: string }
  ): Promise<TagModel[]> {
    const filterParams: (keyof TagModel)[] = ['id', 'name', 'color']

    const query = datastore.createQuery('tag')

    filterParams.forEach((param) => {
      let filterParam = filter ? filter[param] : undefined
      if (filterParam !== undefined && filterParam !== null) {
        query.filters.push({ name: param, op: '=', val: filterParam })
      }
    })

    const [tags] = await datastore.runQuery(query)

    return tags
  }

  static async create({
    name,
    color,
    uid,
  }: {
    name: string
    color: string
    uid: string
  }): Promise<{ id: string }> {
    const id = await this.generateNewId()

    await datastore.insert({
      key: datastore.key(['tag', id]),
      data: {
        id,
        uid,
        name,
        color,
      },
    })

    return { id }
  }

  static async update(args: TagModel): Promise<void> {
    await datastore.update({
      key: datastore.key(['tag', args.id]),
      data: args,
    })
  }

  static async delete(id: string) {
    await datastore.delete(datastore.key(['tag', id]))
  }
}
