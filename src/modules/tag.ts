import { createModule, gql } from 'graphql-modules'

import { Resolvers } from '../generated/graphql'
import { Tag } from '../models'

const resolvers: Resolvers = {
  Query: {
    tags: () => {
      return Tag.find()
    },
  },
  Mutation: {
    createTag: async (root, { name, color }, { uid }) => {
      const { id } = await Tag.create({ name, color, uid })

      return (await Tag.find({ id, uid }))[0]
    },
    updateTag: async (root, { id, name, color }, { uid }) => {
      const todoItem = (await Tag.find({ id, uid }))[0]

      if (todoItem.uid !== uid) {
        throw new Error('User does not own tag')
      }

      await Tag.update({
        ...todoItem,
        ...(name && { name }),
        ...(color && { color }),
      })

      return (await Tag.find({ id, uid }))[0]
    },
    deleteTag: async (root, { id }, { uid }) => {
      const tag = Tag.find({ id, uid })

      if (!tag) {
        throw new Error('Could not find tag')
      }

      await Tag.delete(id)

      return { success: true }
    },
  },
}

export default createModule({
  id: 'tag',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Status {
        success: Boolean!
      }

      type Tag {
        id: ID!
        name: String!
        color: String!
      }

      extend type Query {
        tags: [Tag!]!
      }

      extend type Mutation {
        createTag(name: String!, color: String!): Tag!
        updateTag(id: ID!, name: String, color: String): Tag!
        deleteTag(id: ID!): Status!
      }
    `,
  ],
  resolvers,
})
