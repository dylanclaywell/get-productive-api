import { createModule, gql } from 'graphql-modules'

import { Resolvers, DateInput } from '../generated/graphql'
import logger from '../logger'
import { User } from '../models'

const resolvers: Resolvers = {
  Mutation: {
    createUser: async (root, { uid }) => {
      try {
        await User.create({ uid })
        return {
          success: true,
        }
      } catch (e) {
        logger.log('error', 'Error creating user')

        return {
          success: false,
        }
      }
    },
  },
}

export default createModule({
  id: 'user',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Status {
        success: Boolean!
      }

      extend type Mutation {
        createUser(uid: String!): Status
      }
    `,
  ],
  resolvers,
})
