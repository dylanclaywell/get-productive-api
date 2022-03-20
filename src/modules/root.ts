import { createModule, gql } from 'graphql-modules'

export default createModule({
  id: 'root',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query
      type Mutation
    `,
  ],
  resolvers: {
    Mutation: {},
    Query: {},
  },
})
