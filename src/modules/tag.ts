import { createModule, gql } from 'graphql-modules'

import { Resolvers, DateInput } from '../generated/graphql'
import { Tag } from '../models'

const resolvers: Resolvers = {
  Query: {
    tags: () => {
      return Tag.find()
    },
  },
  Mutation: {
    createTag: async (root, { name, color }) => {
      const { id } = await Tag.create({ name, color })

      return (await Tag.find({ id }))[0]
    },
  },
}

export default createModule({
  id: 'tag',
  dirname: __dirname,
  typeDefs: [
    gql`
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
      }
    `,
  ],
  resolvers,
})
