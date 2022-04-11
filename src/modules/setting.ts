import { createModule, gql } from 'graphql-modules'
import datastore from '../datastore'

import { Resolvers } from '../generated/graphql'
import Setting from '../models/Setting'

const resolvers: Resolvers = {
  Query: {
    theme: async (root, {}, { uid }) => {
      const [response] = await datastore.get(datastore.key(['theme', uid]))

      return {
        type: response?.theme ?? 'light',
      }
    },
  },
  Mutation: {
    setTheme: async (root, { theme }, { uid }) => {
      if (!Setting.isValidTheme(theme)) {
        throw new Error('Invalid theme')
      }

      await Setting.setTheme(uid, theme)

      return true
    },
  },
}

export default createModule({
  id: 'setting',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Theme {
        type: String!
      }

      extend type Query {
        theme: Theme!
      }

      extend type Mutation {
        setTheme(theme: String!): Boolean!
      }
    `,
  ],
  resolvers,
})
